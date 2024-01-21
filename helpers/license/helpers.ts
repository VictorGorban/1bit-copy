import aesjs from 'aes-js'
import NodeRSA from "node-rsa";
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import * as commonHelpers from '@commonHelpers'

const secretBytesForAesKey = Buffer.from([
    91, 125, 198, 226, 82, 133, 193, 5, 156, 240, 165, 11, 69, 186, 168, 84, 231,
    56, 169, 227, 57, 111, 232, 235
  ]);

type SavedLicenseInfo={
    status: string,
    validUntil: string,
    [key: string]: any
}

export function getLicenseInfoForClient(licenseKey: Object): any {
    let result: any = _.pick(licenseKey, ["keyString", "validUntil", "companyData", "userData", "activationScope", "maxDevices"]);
    result.lastUpdate = commonHelpers.formatDateFull(new Date())

    return result
}

/**
 * Равномерно вытягивает keyLength байт из предоставленного буфера.
 * Сюда отдается буфер, состоящий из секретного ключа (прописывается в приложении), и информации о системе 
 * Получается ключ, которы будет уникальный на каждом компьютере, 
 * но при этом независимый от переустановок системы и замены большинства комплектующих.
 * При замене процессора или переносе на другой комп, просто ключ попытается активироваться как для нового компьютера.
 * так как на разных компьютерах длина buff будет разная, это дополнительно увеличивает степерь защиты. 
 */
export function getPseudoRandomKeyFromBuffer(buff: Buffer = Buffer.from([]), keyLength = 1) {
    if (!keyLength || keyLength < 16 || keyLength > 128) {
        throw new Error('Длина ключа должна быть >=16 и <=128')
    }

    if (buff.length <= keyLength) {
        throw new Error('Размер буфера недостаточный, должен быть больше длины ключа')
    }

    // 1. Если длина буфера в 2 и более раз больше чем длина ключа, то просто берем оттуда каждый n (n=Math.floor(buff.length/keyLength)) 
    // нужно построить массив из индексов, которые нужно взять. То есть брать buff[keyLength], buff[keyLength+1] и так далее.
    // чтобы прохождение массива было более равномерным, нужно как бы смещать массив вправо на 1.
    // похоже на шифрование aes cbc, если честно - но не совсем.
    let sequenceSeed = 0;
    for (let byte of buff) {
        sequenceSeed += byte % keyLength;
    }

    if (!sequenceSeed) {
        sequenceSeed = 1;
    }

    let resultKey = getPseudoRandomBytesSequenceWithSeed(keyLength, sequenceSeed);

    return resultKey;
}

export function getPseudoRandomBytesSequenceWithSeed(sequenceLength: number, seed = 1): Array<number> {
    if (sequenceLength < 1) {
        throw new Error('sequenceLength не может быть <0')
    }
    if (seed < 1) {
        throw new Error('seed не может быть <1')
    }
    let result = []
    for (let i = 0; i < sequenceLength; i++) {
        let randomFloat = pseudoRandom();
        let randomByte = Math.floor(randomFloat * 255);
        result.push(randomByte)
    }
    return result;

    function pseudoRandom() {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x); // минуса (который бывает в синусе) здесь не будет.
    }
}

type LicenseData = {
    system: string, cpu: string
    [key: string]: any
}

export function checkLicenseDataBySignature(licenseData: any, systemString: string, cpuString: string, appId: string): boolean {
    try {
        let { signature, validUntil, publicKey } = licenseData
        let deviceData: LicenseData = { system: systemString, cpu: cpuString };
        deviceData = sortObjectKeysAlphabet(deviceData)

        let key = new NodeRSA()

        key.importKey(publicKey, 'pkcs8-public');

        // validUntil сюда отдается уже в виде строки. Повторный формат испортит дату.
        // validUntil = commonHelpers.formatDate(validUntil)
        let stringToCheck = `${appId}__${validUntil}__${JSON.stringify(deviceData)}`
        let result = key.verify(Buffer.from(stringToCheck, 'utf-8'), signature, 'buffer', 'base64');
        // let result = key.verify(Buffer.from(stringToCheck, 'utf-8'), signature, 'buffer', 'base64');
        // console.log('signature check', result, stringToCheck, appId, validUntil)

        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function sortObjectKeysAlphabet<T>(obj: T): T {
    let keys = Object.keys(obj);
    keys = _.sortBy(keys);
    return _.pick(obj, keys) as T;
}

export function encryptAesLicense(textToEncrypt: string, systemString: string, cpuString: string): Buffer {
    let systemWithSecretBytesForKey = Buffer.concat([secretBytesForAesKey, Buffer.from(`${systemString}_|_${cpuString}`)])
    let aesKey = getPseudoRandomKeyFromBuffer(systemWithSecretBytesForKey, 24);
    // по идее, с длиной ключа 24 это aes-192
    let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5)); // а зашифровать я хочу полученную подпись, информацию об активации и ключе, т.е. всё что кроме 
    let bytesToEncrypt = aesjs.utils.utf8.toBytes(textToEncrypt);
    let encryptedBytes = aesCtr.encrypt(bytesToEncrypt);

    return Buffer.from(encryptedBytes);
}

export function encryptAesPlain(textToEncrypt: string, extraString: string): Buffer {
    let systemWithSecretBytesForKey = Buffer.concat([secretBytesForAesKey, Buffer.from(extraString)])
    let aesKey = getPseudoRandomKeyFromBuffer(systemWithSecretBytesForKey, 24);
    // по идее, с длиной ключа 24 это aes-192
    let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5)); // а зашифровать я хочу полученную подпись, информацию об активации и ключе, т.е. всё что кроме 
    let bytesToEncrypt = aesjs.utils.utf8.toBytes(textToEncrypt);
    let encryptedBytes = aesCtr.encrypt(bytesToEncrypt);

    return Buffer.from(encryptedBytes);
}

export function decryptAesLicense(encryptedBuffer: Buffer, systemString: string, cpuString: string): string {
    let systemWithSecretBytesForKey = Buffer.concat([secretBytesForAesKey, Buffer.from(`${systemString}_|_${cpuString}`)])
    let aesKey = getPseudoRandomKeyFromBuffer(systemWithSecretBytesForKey, 24);

    let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5))
    let decryptedBytes = aesCtr.decrypt(encryptedBuffer);
    let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
}

export function decryptAesPlain(encryptedBuffer: Buffer, extraString: string): string {
    let systemWithSecretBytesForKey = Buffer.concat([secretBytesForAesKey, Buffer.from(extraString)])
    let aesKey = getPseudoRandomKeyFromBuffer(systemWithSecretBytesForKey, 24);

    let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5))
    let decryptedBytes = aesCtr.decrypt(encryptedBuffer);
    let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
}

export async function readAndDecryptLicenseBinaryAes(licenseInfoPathBin: string, systemString: string, cpuString: string): Promise<any> {
    if (fs.existsSync(licenseInfoPathBin)) {
        let licenseInfoBinaryEncrypted = await fs.promises.readFile(
            licenseInfoPathBin
        );
        let licenseInfoContent = decryptAesLicense(licenseInfoBinaryEncrypted, systemString, cpuString)

        let result;
        try {
            result = JSON.parse(licenseInfoContent);
        } catch (e) { throw new Error('Ошибка парсинга json') }
        return result;
    } else {
        throw new Error('Не найден файл лицензии bin')
    }
}

export async function readLicenseJson(licenseInfoPathJson: string): Promise<any> {
    if (fs.existsSync(licenseInfoPathJson)) {
        let licenseInfoContent = await fs.promises.readFile(
            licenseInfoPathJson,
            "utf-8"
        ) as unknown as string;
        let result: any;
        try {
            result = JSON.parse(licenseInfoContent);
        } catch (e) { throw new Error('Ошибка парсинга json') }
        // console.log("savedLicenseInfo json", result);
        return result;
    } else {
        throw new Error('Не найден файл лицензии bin')
    }
}

export function offlineLicenseCheck(savedLicenseInfoFromBin: SavedLicenseInfo, systemString: string, cpuString: string, appId: string): string {
    let errorMessage = ''
    if (savedLicenseInfoFromBin.status != 'active') {
        errorMessage = 'Лицензия неактивна'
    } else if (savedLicenseInfoFromBin.validUntil && commonHelpers.parseDate(savedLicenseInfoFromBin.validUntil) < new Date()) {
        errorMessage = `Время действия лиц. ключа истекло ${savedLicenseInfoFromBin.validUntil}`
    } else if (!checkLicenseDataBySignature(savedLicenseInfoFromBin, systemString, cpuString, appId)) { // проверка подписи
        errorMessage = 'Не удается проверить подпись устройства в режиме оффлайн. Подключитесь к интернету и активируйте текущее устройство'
    }
    return errorMessage;
}