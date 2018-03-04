import * as Imap from "imap";
import { inspect } from "util";
import * as moment from "moment";
import { IRuleModel } from "../../models/rules/Rule";
import { SearchCriterias } from "./SearchCriteria";
import { createSearchCriteria } from "./SearchCriteriaProvider";
import { log } from "./../LogService";
import { IUserModel } from "../../models/users/User";
import { insertMovedEmailsStat } from "../StatService";
import { IJobRunModel } from "../../models/stat/JobRun";

const createConfig = ({ imapConfig }: IUserModel): Imap.Config => {
  const config: Imap.Config = {
    user: imapConfig.userName,
    password: imapConfig.password,
    host: imapConfig.host,
    port: imapConfig.port,
    tls: true
  };

  return config;
};

const openInbox = (imap: Imap, cb: (error: Error, box: Imap.Box) => void) => {
  imap.openBox("INBOX", true, cb);
};
const isAfter = (period: number, emailDate: string) => {
  const c = moment().utc();
  c.add(-period, "minutes");
  return c.isAfter(moment(emailDate));
};
const processEmails = (
  config: Imap.Config,
  rule: IRuleModel,
  jobRun: IJobRunModel
) => {
  const searchCriteria: SearchCriterias = createSearchCriteria(rule);
  log("SearchCriterias created", "info", rule.userID, rule.id, searchCriteria);
  const imap: Imap = new Imap(config);

  imap.once("ready", function () {
    openInbox(imap, function (_, __) {
      // imap types are using any, think about sending PR
      // tslint:disable-next-line:no-any
      imap.search(searchCriteria as any[], async (_, uids) => {
        console.log("uids:", uids);
        if (uids.length === 0) {
          imap.end();
          log("No valid mails discovered", "success", rule.userID, rule.id);
          return;
        }
        const validUIDs = Array<string>();
        const f = imap.fetch(uids, { bodies: "" });
        f.on("message", function (msg: Imap.ImapMessage, _) {
          msg.once("attributes", function (attrs) {
            if (isAfter(rule.period, inspect(attrs.date))) {
              validUIDs.push(inspect(attrs.uid));
            }
          });
        });
        f.once("error", function (err) {
          log("Fetch error", "error", rule.userID, rule.id, err);
        });
        f.once("end", function () {
          if (validUIDs.length === 0) {
            imap.end();
            log("No valid mails discovered", "success", rule.userID, rule.id);
            return;
          }
          log("Moving emails", "info", rule.userID, rule.id, {
            validUIDs,
            boxname: rule.folderName
          });
          imap.openBox(rule.folderName, (openBoxError, _) => {
            if (openBoxError) {
              imap.addBox(rule.folderName, _ => {
                moveEmails(imap, validUIDs, rule, jobRun);
              });
            }
            moveEmails(imap, validUIDs, rule, jobRun);
          });
        });
      });
    });
  });

  imap.once("error", function (err: Error) {
    log("Connection error", "error", rule.userID, rule.id, { err, config });
  });

  imap.once("end", function () {
    log("Connection ended", "info", rule.userID, rule.id);
  });
  imap.connect();
};

function moveEmails(
  imap: Imap,
  uids: string[],
  rule: IRuleModel,
  jobRun: IJobRunModel
) {
  openInbox(imap, () => {
    const { folderName } = rule;
    imap.move(uids, folderName, moveError => {
      if (moveError) {
        log("Move error", "info", rule.userID, rule.id, { folderName, uids });
      }
      imap.end();
      log("Emails moved", "success", rule.userID, rule.id, {
        folderName,
        uids
      });
      insertMovedEmailsStat(jobRun.id, rule.userID, rule.id, uids.length);
    });
  });
}

export { processEmails, createConfig };
