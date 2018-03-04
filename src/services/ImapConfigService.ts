import {
  ImapConfig,
  IImapConfig,
} from "../models/users/ImapConfig";
import { Request } from "express";

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
    await ImapConfig.updateOne({ userID: req.user.id }, config);
    return ImapConfig.findOne({ userID: req.user.id });
  } else {
    return ImapConfig.create(new ImapConfig(config));
  }
};

const configExists = async (userID: string): Promise<boolean> => {
  const config = await ImapConfig.find({ userID }).limit(1);
  return config.length > 0;
};

const nameof = <T>(key: keyof T): keyof T => key;

const getConfigByUserID = (userID: string) => {
  return ImapConfig.findOne({ userID });
};

const getFilledImapConfigByUserID = (userID: string) => {
  return ImapConfig.findOne({ userID })
    .where(nameof<IImapConfig>("userName"), { $ne: null })
    .where(nameof<IImapConfig>("password"), { $ne: null })
    .where(nameof<IImapConfig>("host"), { $ne: null })
    .where(nameof<IImapConfig>("port"), { $ne: null });
};

export { getFilledImapConfigByUserID, saveImapConfig, getConfigByUserID };
