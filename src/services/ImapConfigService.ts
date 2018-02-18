import { ImapConfig } from "../models/users/ImapConfig";
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
    await ImapConfig.update({ userID: req.user.id }, config);
    return ImapConfig.findOne({ userID: req.user.id });
  } else {
    return ImapConfig.create(config);
  }
};

const configExists = async (userID: string): Promise<boolean> => {
  const config = await ImapConfig.find({ userID }).limit(1);
  return config.length > 0;
};

const getConfigByUserID = (userID: string) => {
  return ImapConfig.findOne({ userID });
};

export { saveImapConfig, getConfigByUserID };
