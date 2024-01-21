import _ from 'lodash'
import aesjs from 'aes-js'
import NodeRSA from "node-rsa";
import * as commonHelpers from '@commonHelpers'

export const tableProjection = {
    protectionSettings: 0,
    transmissionProtectionAesKey: 0
}

export function generateRsaSignatureAppId({ privateKey, validUntil, appId, deviceData }) {
    // deviceData должен иметь постоянный порядок ключей. Поэтому сортирую их по алфавиту
    deviceData = sortObjectKeysAlphabet(deviceData)

    let key = new NodeRSA()

    key.importKey(privateKey, 'pkcs8-private');

    validUntil = commonHelpers.formatDate(validUntil)
    let stringToSign = `${appId}__${validUntil}__${JSON.stringify(deviceData)}`
    let signature = key.sign(Buffer.from(stringToSign, 'utf-8'), 'base64');
    // let result = key.verify(Buffer.from(stringToSign, 'utf-8'), signature, 'buffer', 'base64');
    // console.log('signature check private', result, deviceData, validUntil, appId)

    return signature;
}

// тут еще должна быть проверка подписи. И т.к. проверка подписи может проводиться внутри приложения, в оффлайне, где 100% нет секрета... Секрет нужно заменить на что-то другое.

function sortObjectKeysAlphabet(obj) {
    let keys = Object.keys(obj);
    keys = _.sortBy(keys);
    return _.pick(obj, keys)
}


// TODO во всех хелперах стоит добавить декларации типов (и только их!), т.к. все типы запомнить сложно
// допустима любая длина ключа секрета, но лучше использовать секрет с длиной 24 байта - получается защита уровня aes-192
export function encryptAesPlain(textToEncrypt, secretBytesForAesKey, extraString) {
    let systemWithSecretBytesForKey = Buffer.concat([secretBytesForAesKey, Buffer.from(extraString)])
    let aesKey = getPseudoRandomKeyFromBuffer(systemWithSecretBytesForKey, 24);
    let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5));
    let bytesToEncrypt = aesjs.utils.utf8.toBytes(textToEncrypt);
    let encryptedBytes = aesCtr.encrypt(bytesToEncrypt);

    return Buffer.from(encryptedBytes);
}

export function decryptAesPlain(encryptedBytes, secretBytesForAesKey, extraString) {
    let systemWithSecretBytesForKey = Buffer.concat([secretBytesForAesKey, Buffer.from(extraString)])
    let aesKey = getPseudoRandomKeyFromBuffer(systemWithSecretBytesForKey, 24);

    let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5))
    let decryptedBytes = aesCtr.decrypt(encryptedBytes);
    let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
}

/**
 * Равномерно вытягивает keyLength байт из предоставленного буфера.
 * Сюда отдается буфер, состоящий из секретного ключа (прописывается в приложении), и информации о системе 
 * Получается ключ, которы будет уникальный на каждом компьютере, 
 * но при этом независимый от переустановок системы и замены большинства комплектующих.
 * При замене процессора или переносе на другой комп, просто ключ попытается активироваться как для нового компьютера.
 * так как на разных компьютерах длина buff будет разная, это дополнительно увеличивает степерь защиты. 
 */
export function getPseudoRandomKeyFromBuffer(buff = [], keyLength = 1) {
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

export function getPseudoRandomBytesSequenceWithSeed(sequenceLength, seed = 1) {
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
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x); // минуса (который бывает в синусе) здесь не будет.
    }
}