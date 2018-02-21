import * as Imap from "imap";
import { inspect } from "util";
import * as moment from "moment";
import { IRuleModel } from "../../models/rules/Rule";
import { SearchCriterias } from "./SearchCriteria";
import { createSearchCriteria } from "./SearchCriteriaProvider";
import { log } from "./../LogService";
import { IUserModel } from "../../models/users/User";

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

const openInbox = (imap: Imap, cb) => {
  imap.openBox("INBOX", true, cb);
};
const isAfter = (period: number, emailDate: string) => {
  const c = moment().utc();
  c.add(-period, "minutes");
  return c.isAfter(moment(emailDate));
};
const processEmails = (config: Imap.Config, rule: IRuleModel) => {
  const searchCriteria: SearchCriterias = createSearchCriteria(rule);
  log("SearchCriterias created", "info", null, rule.id, searchCriteria);
  const imap: Imap = new Imap(config);

  imap.once("ready", function() {
    openInbox(this, function(err, box) {
      imap.search(searchCriteria as any[], async (err, uids) => {
        console.log("uids:", uids);
        if (uids.length === 0) {
          imap.end();
          log("No valid mails discovered", "success", null, rule.id);
          return;
        }
        const validUIDs = Array<string>();
        const f = imap.fetch(uids, { bodies: "" });
        f.on("message", function(msg: Imap.ImapMessage, seqno) {
          msg.once("attributes", function(attrs) {
            if (isAfter(rule.period, inspect(attrs.date))) {
              validUIDs.push(inspect(attrs.uid));
            }
          });
        });
        f.once("error", function(err) {
          log("Fetch error", "error", null, rule.id, err);
        });
        f.once("end", function() {
          if (validUIDs.length === 0) {
            imap.end();
            log("No valid mails discovered", "success", null, rule.id);
            return;
          }
          log("Moving emails", "info", null, rule.id, {
            validUIDs,
            boxname: rule.folderName
          });
          imap.openBox(rule.folderName, (openBoxError, mailbox) => {
            if (openBoxError) {
              imap.addBox(rule.folderName, createBoxError => {
                moveEmails(imap, mailbox, validUIDs, rule.folderName, rule.id);
              });
            }
            moveEmails(imap, mailbox, validUIDs, rule.folderName, rule.id);
          });
        });
      });
    });
  });

  imap.once("error", function(err) {
    log("Connection error", "error", null, rule.id, { err, config });
  });

  imap.once("end", function() {
    log("Connection ended", "info", null, rule.id);
  });
  imap.connect();
};

function moveEmails(
  imap: Imap,
  mailbox: Imap.Box,
  uids: string[],
  box: string,
  ruleID: string
) {
  openInbox(imap, () => {
    imap.move(uids, box, moveError => {
      if (moveError) {
        log("Move error", "info", null, ruleID, { box, uids });
      }
      imap.end();
      log("Emails moved", "success", null, ruleID, { box, uids });
    });
  });
}

export { processEmails, createConfig };
