import { Log, LogLevel } from "../models/logs/Log";
import { LogName, AppLogName } from "../models/logs/LogName";
import { MailLog, IMailLogModel } from "../models/logs/MailLog";
const CircularJSON = require("circular-json");

// tslint:disable-next-line:no-any
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
  userID: string,
  ruleID: string,
  // tslint:disable-next-line:no-any
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
  const mailLog = await MailLog.findOne().sort({ dateCreated: "desc" });
  if (mailLog) {
    return mailLog;
  }
  return new MailLog();
};

const logSync = async (
  name: LogName,
  logLevel: LogLevel,
  userID?: string,
  ruleID?: string,
  // tslint:disable-next-line:no-any
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

// tslint:disable-next-line:no-any
const logJobStatus = (name: LogName, logLevel: LogLevel, content?: any) => {
  const log = new Log({
    name,
    content: CircularJSON.stringify(content),
    logLevel
  });
  log.save();
  console.log(
    `Log name: ${name}, Log level: ${logLevel} \nContent: ${
    log.content
    }`
  );
};

// tslint:disable-next-line:no-any
const logProcessedUser = (name: LogName, logLevel: LogLevel, userID: string, content?: any) => {
  const log = new Log({
    name,
    userID,
    content: CircularJSON.stringify(content),
    logLevel
  });
  log.save();
  console.log(
    `Log name: ${name}, Log level: ${logLevel}\n-- userID: ${userID} \ --content: ${log.content}`
  );
};

export { logInfo, log, logSync, getLastMailLog, logJobStatus, logProcessedUser };
