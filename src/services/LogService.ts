import { Log, LogLevel } from "../models/logs/Log";
import { LogName, AppLogName } from "../models/logs/LogName";
import { MailLog, IMailLogModel } from "../models/logs/MailLog";
const CircularJSON = require("circular-json");

const logInfo = (name: AppLogName, content: any, userID?: string) => {
  const logLevel: LogLevel = "info";
  const log = new Log({
    name,
    content: CircularJSON.stringify(content),
    userID,
    logLevel
  });
  log.save();
  console.log(
    `Log name: ${name}, Log level: ${logLevel} --userID: ${userID} \nContent: ${
      log.content
    }`
  );
};
const log = (
  name: LogName,
  logLevel: LogLevel,
  userID?: string,
  ruleID?: string,
  content?: any
) => {
  const mailLog = new MailLog({
    name,
    userID,
    ruleID,
    content: CircularJSON.stringify(content),
    logLevel
  });
  mailLog.save();
  console.log(
    `Log name: ${name}, Log level: ${logLevel}\n-- userID: ${userID} ruleID: ${ruleID}`
  );
};

const getLastMailLog = async (): Promise<IMailLogModel> => {
  return await MailLog.findOne().sort({ dateCreated: "desc" });
};

const logSync = async (
  name: LogName,
  logLevel: LogLevel,
  userID?: string,
  ruleID?: string,
  content?: any
) => {
  const mailLog = new MailLog({
    name,
    userID,
    ruleID,
    content: CircularJSON.stringify(content),
    logLevel
  });
  await mailLog.save();
  console.log(
    `Log name: ${name}, Log level: ${logLevel}\n-- userID: ${userID} ruleID: ${ruleID}`
  );
};

export { logInfo, log, logSync, getLastMailLog };
