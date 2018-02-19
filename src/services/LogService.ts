import { Log, LogLevel } from "../models/logs/Log";
import { LogName } from "../models/logs/LogName";
import { MailLog } from "../models/logs/MailLog";
const CircularJSON = require("circular-json");

const logInfo = (name: string, content: any, userID?: string) => {
  const logLevel: LogLevel = "info";
  const log = new Log({
    name,
    content: CircularJSON.stringify(content),
    userID,
    logLevel
  });
  log.save();
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

export { logInfo, log, logSync };
