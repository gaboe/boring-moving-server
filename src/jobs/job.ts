import { logJobStatus, logProcessedUser, getLastMailLog, log } from "../services/LogService";
import { getAllUsers } from "../services/UserService";
import { getFilledImapConfigByUserID } from "../services/ImapConfigService";
import { createConfig, processEmails } from "../services/imap/ImapService";
import { getUserRules } from "../services/RuleService";
import { IUserModel } from "../models/users/User";
import {
  createJobRun,
  setCurrentJobAsFinished
} from "./../services/StatService";
import * as moment from "moment";
import { IJobRunModel } from "../models/stat/JobRun";

const executeJob = async () => {
  logJobStatus("Job started", "info");
  const jobRun = await createJobRun("EmailMover");
  const users = await getAllUsers();
  watchEndOfJob(5, jobRun);

  users.eachAsync(async user => {
    const imapConfig = await getFilledImapConfigByUserID(user.id);
    if (imapConfig) {
      user.imapConfig = imapConfig;
      processUser(user, jobRun);
    }
  });
};

const watchEndOfJob = (timeOutSeconds: number, jobRun: IJobRunModel) => {
  setTimeout(async () => {
    if (await wasLastEmailLogLateEnought(timeOutSeconds)) {
      const job = await setCurrentJobAsFinished(jobRun.id);
      logJobStatus("Job exited", "success", job);
      return;
    }
    console.log("Job is still running");
    watchEndOfJob(timeOutSeconds, jobRun);
  }, 5000);
};

const wasLastEmailLogLateEnought = async (timeOutSeconds: number) => {
  const lastLog = await getLastMailLog();
  const lastLogDate = moment(lastLog.dateCreated);
  const duration = moment.duration(moment().diff(lastLogDate)).seconds();
  return timeOutSeconds < duration;
};

const processUser = (user: IUserModel, jobRun: IJobRunModel) => {
  logProcessedUser("Processing user", "info", user.id, user.imapConfig);
  const config = createConfig(user);
  getUserRules(user.id)
    .cursor()
    .eachAsync(rule => {
      log("Processing rule", "info", user.id, rule.id, rule);
      processEmails(config, rule, jobRun);
    });
};

export { executeJob };
