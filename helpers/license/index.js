// TODO все это надо скомпилить в jsc.
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import sysInfo from 'systeminformation'; // варнинг про osx присутствует, но не мешает
import * as serverHelpers from '@serverHelpers'
import * as commonHelpers from '@commonHelpers'
import * as licenseHelpers from "./helpers"

const isDevelopment = process.env.NODE_ENV == 'development'

const appId = "license-server-web";
const licenseUrl = isDevelopment
    ? "http://127.0.0.1:3008"
    // : "http://127.0.0.1:3009"
    : "http://94.103.83.221:3008";

// жаль конечно что приходится юзать глобальную область, очень жаль... А как иначе, если на каждую страницу (в деве как минимум) тут как будто новый импорт.
// ну хотя бы критические данные в глобальной области не храню, потому что из глобальной вполне себе можно выудить переменные.
global.licenseInfo = global.licenseInfo || null;

export function getLicenseInfo() {
    return global.licenseInfo;
}

function setLicenseInfoSuccess(message = null, data) {
    global.licenseInfo = {
        status: 'success',
        message,
        ...data
    }
}

function setLicenseInfoError(message = null, data) {
    global.licenseInfo = {
        status: 'error',
        message,
        ...data
    }
}

export default async function checkLicense() {
    // setLicenseInfoError("test")

    let system, cpu, bios, baseboard, uuid;
    await Promise.all([
        sysInfo.system().then(obj => system = obj),
        sysInfo.cpu().then(obj => cpu = obj),
        sysInfo.bios().then(obj => bios = obj),
        sysInfo.baseboard().then(obj => baseboard = obj),
        sysInfo.uuid().then(obj => uuid = obj),
    ])

    let systemString = `${bios?.serial}_|_${system?.serial || system?.uuid}_|_${baseboard?.serial}_|_${uuid?.macs?.join(',')}`
    let cpuString = `${cpu?.manufacturer}_|_${cpu?.brand}_|_${cpu?.family}_|_${cpu?.model}_|_${cpu?.socket}`

    let demoLicenseInfoPathJson = "license/demoLicenseInfo.json";
    let demoLicenseInfoPathBin = "license/demoLicenseInfo.bin";

    let licenseInfoPathJson = "license/licenseInfo.json";
    let licenseInfoPathBin = "license/licenseInfo.bin";

    let isServerActivationRequired = false;
    let savedLicenseInfoFromBin;
    let savedLicenseInfoFromJson;

    try {
        // проверить существование основного json файла. Если его нет, то пути меняются на demo.
        try {
            await fs.promises.access(licenseInfoPathJson, fs.constants.R_OK)
            console.log('Прочитан основной файл лицензии');
        } catch (e) {
            console.error('Не удается прочитать основной файл лицензии, используется лицензия демо');
            licenseInfoPathJson = demoLicenseInfoPathJson;
            licenseInfoPathBin = demoLicenseInfoPathBin;
        }

        // это еще не проверка лицензии, это получение сохраненных данных.
        // План такой: 1. Ищем бинарный файл. В бинарном файле актуальная информация. Если он есть, читаем его и работаем с ним. Json-файл только для ознакомления, т.к. информация в нем не зашифрована и легко изменяется.
        // Если его нет, то читаем файл json и ТРЕБУЕМ интернет для получения актуальных данных.
        try {
            savedLicenseInfoFromBin = await licenseHelpers.readAndDecryptLicenseBinaryAes(licenseInfoPathBin, systemString, cpuString);
        } catch (e) {
            isServerActivationRequired = true;
            console.error(`Не удается прочитать или дешифровать bin файл лицензии. Ошибка: ${e.message}`)
        }

        try {
            savedLicenseInfoFromJson = await licenseHelpers.readLicenseJson(licenseInfoPathJson);
            if (!savedLicenseInfoFromJson.keyString) {
                throw new Error('Нет строки ключа')
            }
        } catch (e) {
            throw new Error(`Не найден json файл лицензии или поврежден. Загрузите файл ключа, обычно он называется licenseInfo.json. Ошибка: ${e.message}`)
        }

        // по факту, если есть интернет, мне в любом случае надо сначала попытаться активировать на сервере (activateRsa). 
        // Если не выйдет, то уже читать и проверять оффлайн значения.
        // используется AES-192, 24 числа (хотя хватит и 128, все равно взломать нереально)
        // через интернет достаточно просто зашифровать ключом. Не нужно использовать инфу о системе.
        let deviceDataEncrypted = licenseHelpers.encryptAesPlain(JSON.stringify({
            system: systemString,
            cpu: cpuString,
            appId: appId
        }), savedLicenseInfoFromJson.keyString);
        let deviceDataEncryptedBase64 = deviceDataEncrypted.toString('base64');

        console.log('До онлайн проверки activateDeviceRSAJson')
        let requestResult = await serverHelpers.submitObject(
            `${licenseUrl}/api/licenseKeys/activateDeviceRSAJson`,
            {
                keyString: savedLicenseInfoFromJson.keyString,
                deviceData: deviceDataEncryptedBase64
            },
            { returnRawResult: true }
        );
        if (!requestResult) {
            throw new Error('Не удается проверить лицензию. Похоже что нет интернета')
        }

        // если не удается получить ответ от сервера, то используем сохраненную информацию о лицензировании
        // если удалось получить ответ, то сохраняем эту информацию
        console.log("requestResult", requestResult?.status ? requestResult.status : requestResult, isServerActivationRequired);
        let requestStatus = requestResult.status;
        let requestMessage = requestResult.message;

        // Если ключ неактивен, то все равно сервер должен дать ответ с ключом, чтобы потом в офлайне его использовать.
        let activationResult = requestResult.data;
        if (requestStatus == 'error' && (!activationResult || _.isEmpty(activationResult))) {
            throw new Error(requestMessage)
        }

        activationResult = licenseHelpers.decryptAesPlain(Buffer.from(activationResult, 'base64'), savedLicenseInfoFromJson.keyString)
        activationResult = JSON.parse(activationResult)
        savedLicenseInfoFromJson.status = activationResult.status;
        savedLicenseInfoFromJson.validUntil = activationResult.validUntil;
        await fs.promises.writeFile(licenseInfoPathJson, JSON.stringify(savedLicenseInfoFromJson), 'utf-8')

        let licenseObjForBin = activationResult;
        let encryptedLicense = licenseHelpers.encryptAesLicense(JSON.stringify(licenseObjForBin), systemString, cpuString)
        await fs.promises.writeFile(licenseInfoPathBin, encryptedLicense)
        // FIXME оффлайн проверка всегда неудачна, подпись не проверяется.
        console.log('Записан bin файл лицензии', licenseObjForBin.validUntil)
        savedLicenseInfoFromBin = licenseObjForBin;

        // после того как обновили оффлайн-информацию о ключе (чтобы в офлайне без интернета потом не показывало что активация в порядке), показываем ошибку если она есть.
        if (requestStatus == 'error') {
            isServerActivationRequired = true;
            throw new Error(requestMessage)
        }

        setLicenseInfoSuccess(null, licenseHelpers.getLicenseInfoForClient(savedLicenseInfoFromBin))
        // console.log('Лицензия проверена - ОК, ключ', savedLicenseInfoFromBin.keyString)
    } catch (e) {
        try {
            // сюда мы должны попадать если сервер недоступен или 404. 
            console.error("online license check failed", e.message, isServerActivationRequired);
            if (isServerActivationRequired) {
                setLicenseInfoError(e.message, licenseHelpers.getLicenseInfoForClient(savedLicenseInfoFromBin))
            } else {
                console.log('онлайн не удался, офлайн-проверка', savedLicenseInfoFromBin.validUntil)
                let errorMessage = licenseHelpers.offlineLicenseCheck(savedLicenseInfoFromBin, systemString, cpuString, appId);
                if (errorMessage) { // то есть неактивная или просроченная
                    console.log('offline license check failed, too', errorMessage)
                    setLicenseInfoError(errorMessage, licenseHelpers.getLicenseInfoForClient(savedLicenseInfoFromBin))
                } else {
                    setLicenseInfoSuccess(null, licenseHelpers.getLicenseInfoForClient(savedLicenseInfoFromBin))
                }
            }
        } catch (catchErr) {
            setLicenseInfoError(catchErr.message, licenseHelpers.getLicenseInfoForClient(savedLicenseInfoFromBin))
        }
    }
}