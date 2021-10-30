import NodeRSA from "node-rsa";

function getSignature() {
    const key = new NodeRSA({ b: 1024 });
    const privateKey = key.exportKey('private')
    const publicKey = key.exportKey('public')
    const signature = {
        publicKey: publicKey,
        privateKey: privateKey
    }
    return signature
}

function encryptData(data, public_key) {
    const key = new NodeRSA(public_key)
    let encryptedData = key.encrypt(data, 'base64')
    return encryptedData
}

function decryptData(data, private_key) {
    const key = new NodeRSA(private_key)
    let decryptedData = key.decrypt(data, 'utf-8')
    return decryptedData
}

export { getSignature, encryptData, decryptData }