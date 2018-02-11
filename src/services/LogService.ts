import { Log, LogLevel } from "../models/logs/Log";
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

export { logInfo };
