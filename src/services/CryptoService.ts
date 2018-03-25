import * as  crypto from "crypto";


const IV_LENGTH = 16;
const getEncryptionKey = () => {
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
    if (ENCRYPTION_KEY) {
        return ENCRYPTION_KEY;
    }
    throw new Error("ENCRYPTION_KEY does not exists");
};
const encrypt = (text: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", new Buffer(getEncryptionKey()), iv);
    let encrypted = cipher.update(Buffer.from(text, "utf8"));

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt = (text: string) => {
    const textParts = text.split(":");
    const shift = textParts.shift();
    if (shift) {
        const iv = new Buffer(shift, "hex");
        const encryptedText = new Buffer(textParts.join(":"), "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", new Buffer(getEncryptionKey()), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
    return "";
};

export { encrypt, decrypt };
