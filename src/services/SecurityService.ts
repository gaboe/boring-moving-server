import { IImapConfigModel, IImapConfig } from "../models/users/ImapConfig";
import { decrypt, encrypt } from "./CryptoService";

const decryptImapConfig = (imapConfig: IImapConfigModel | null) => {
    if (imapConfig === null) {
        return null;
    }
    imapConfig.password = decrypt(imapConfig.password);
    console.log(imapConfig.password);
    return imapConfig;
};

const encryptImapConfig = (imapConfig: IImapConfigModel | IImapConfig) => {
    imapConfig.password = encrypt(imapConfig.password);
    console.log(imapConfig.password);
    return imapConfig;
};

export { decryptImapConfig, encryptImapConfig };