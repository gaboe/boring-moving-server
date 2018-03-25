import { IImapConfigModel, IImapConfig } from "../models/users/ImapConfig";
import { decrypt, encrypt } from "./CryptoService";
import { ApolloRequest } from "apollo-graphql-server";

const decryptImapConfig = (imapConfig: IImapConfigModel | null) => {
    if (imapConfig === null) {
        return null;
    }
    imapConfig.password = decrypt(imapConfig.password);
    return imapConfig;
};

const encryptImapConfig = (imapConfig: IImapConfigModel | IImapConfig) => {
    imapConfig.password = encrypt(imapConfig.password);
    return imapConfig;
};

type ExpressRequest = ApolloRequest["req"];

const withAuthentification = <T>(req: ExpressRequest, fn: (userID: string) => T): T | null => {
    if (req.user && req.user.id) {
        return fn(req.user.id);
    }
    return null;
};

export { decryptImapConfig, encryptImapConfig, withAuthentification };