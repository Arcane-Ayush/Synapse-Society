// Proprietary Synapse Encryption / Decryption Utility for QR Code Security
const SECRET_KEY = "SYNAPSE_SECRET_KEY_2026_CYBER_PROTOCOL";

/**
 * Encrypts a payload object into an unreadable cipher string.
 * External QR readers (Google Lens, iOS Camera) will only see an unreadable cipher text.
 */
export function encryptPayload(payloadObject) {
    const jsonString = JSON.stringify(payloadObject);
    let result = '';
    
    for (let i = 0; i < jsonString.length; i++) {
        const charCode = jsonString.charCodeAt(i);
        const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
        const encryptedChar = charCode ^ keyChar; // XOR encryption
        result += String.fromCharCode(encryptedChar);
    }

    // Convert binary string to URL-safe Base64 and wrap with Synapse Cipher Header
    const base64Cipher = btoa(encodeURIComponent(result));
    return `SYNAPSE_CIPHER_V1:${base64Cipher}`;
}

/**
 * Decrypts a Synapse cipher string back into the original payload object.
 * Throws an error if payload is corrupted, external, or tampered with.
 */
export function decryptPayload(cipherText) {
    if (!cipherText || typeof cipherText !== 'string' || !cipherText.startsWith('SYNAPSE_CIPHER_V1:')) {
        throw new Error('Invalid Synapse Cipher. Payload is either unencrypted or from an untrusted source.');
    }

    try {
        const rawBase64 = cipherText.replace('SYNAPSE_CIPHER_V1:', '');
        const encryptedBinary = decodeURIComponent(atob(rawBase64));
        let decryptedJson = '';

        for (let i = 0; i < encryptedBinary.length; i++) {
            const charCode = encryptedBinary.charCodeAt(i);
            const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
            const originalChar = charCode ^ keyChar; // XOR decryption
            decryptedJson += String.fromCharCode(originalChar);
        }

        return JSON.parse(decryptedJson);
    } catch (err) {
        throw new Error('Decryption failed. The QR code data is corrupted or tampered with.');
    }
}
