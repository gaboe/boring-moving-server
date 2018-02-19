import { log } from "../services/LogService";
import { getAllUsers } from "../services/UserService";
import { getFilledImapConfigByUserID } from "../services/ImapConfigService";
import { createConfig, processEmails } from "../services/imap/ImapService";
import { getUserRules } from "../services/RuleService";
import { IUserModel } from "../models/users/User";

const executeJob = async () => {
  log("Job started", "info");
  const users = await getAllUsers();
  users.eachAsync(async user => {
    const imapConfig = await getFilledImapConfigByUserID(user.id);
    if (imapConfig) {
      user.imapConfig = imapConfig;
      processUser(user);
    }
  });
};

const processUser = (user: IUserModel) => {
  log("Processing user", "info", user.id, null, user.email);
  const config = createConfig(user);
  const rules = getUserRules(user.id)
    .cursor()
    .eachAsync(rule => {
      log("Processing rule", "info", user.id, rule.id, rule);
      processEmails(config, rule);
    });
};

export { executeJob };
