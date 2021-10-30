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

function encryptData() {
    
}

export { getSignature, encryptData }