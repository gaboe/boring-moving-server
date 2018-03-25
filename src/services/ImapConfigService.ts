import {
  ImapConfig,
  IImapConfig,
} from "../models/users/ImapConfig";
import { Request } from "express";
import { decryptImapConfig, encryptImapConfig } from "./SecurityService";

const saveImapConfig = async (
  userName: string,
  password: string,
  host: string,
  port: number,
  req: Request
) => {
  const config: IImapConfig = {
    host,
    password,
    port,
    userName,
    userID: req.user.id
  };

  if (await configExists(req.user.id)) {
    await ImapConfig.updateOne({ userID: req.user.id }, encryptImapConfig(config));
    return decryptImapConfig(await ImapConfig.findOne({ userID: req.user.id }));
  } else {
    return ImapConfig.create(new ImapConfig(config));
  }
};

const configExists = async (userID: string): Promise<boolean> => {
  const config = await ImapConfig.find({ userID }).limit(1);
  return config.length > 0;
};

const nameof = <T>(key: keyof T): keyof T => key;

const getConfigByUserID = async (userID: string) => {
  return decryptImapConfig(await ImapConfig.findOne({ userID }));
};

const getFilledImapConfigByUserID = (userID: string) => {
  return ImapConfig.findOne({ userID })
    .where(nameof<IImapConfig>("userName"), { $ne: null })
    .where(nameof<IImapConfig>("password"), { $ne: null })
    .where(nameof<IImapConfig>("host"), { $ne: null })
    .where(nameof<IImapConfig>("port"), { $ne: null });
};

const hasCompleteImapConfig = async (userID: string) => {
  const imapConfig = await getConfigByUserID(userID);
  if (imapConfig && imapConfig.userName && imapConfig.password && imapConfig.port && imapConfig.host) {
    return true;
  }
  return false;
};

export { getFilledImapConfigByUserID, saveImapConfig, getConfigByUserID, hasCompleteImapConfig };
