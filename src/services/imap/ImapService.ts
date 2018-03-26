import * as Imap from "imap";
import { inspect } from "util";
import * as moment from "moment";
import { IRuleModel, IRule } from "../../models/rules/Rule";
import { createSearchCriteria } from "./SearchCriteriaProvider";
import { log } from "./../LogService";
import { insertMovedEmailsStat } from "../StatService";
import { IJobRunModel } from "../../models/stat/JobRun";
import { IImapConfig } from "../../models/users/ImapConfig";
import { SearchCriterias } from "./SearchCriteria";

const createConfig = (imapConfig: IImapConfig): Imap.Config => {
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

type LogDefintion = {
  onSearchCriteriasCreated: (searchCriterias: SearchCriterias) => void,
  onNoValidEmailsDiscovered: () => void,
  onFechError: (error: Error) => void,
  onConnectionError: (error: Error) => void,
  onConnectionEnd: () => void
};

const processEmails = (
  config: Imap.Config,
  rule: IRule,
  processFn: (
    imap: Imap,
    uids: string[],
  ) => void,
  logs?: LogDefintion,
  forceBoxCreation: boolean = true
) => {
  const searchCriteria: SearchCriterias = createSearchCriteria(rule);
  if (logs) {
    logs.onSearchCriteriasCreated(searchCriteria);
  }
  const imap: Imap = new Imap(config);

  imap.once("ready", function () {
    openInbox(imap, function (_, __) {
      // tslint:disable-next-line:no-any
      imap.search(searchCriteria as any[], async (_, uids) => {
        console.log("uids:", uids);
        if (uids.length === 0) {
          imap.end();
          if (logs) {
            logs.onNoValidEmailsDiscovered();
          }
          return;
        }
        const validUIDs = Array<string>();
        const fetch = imap.fetch(uids, { bodies: "" });
        fetch.on("message", function (msg: Imap.ImapMessage, _) {
          msg.once("attributes", function (attrs) {
            if (isAfter(rule.period, inspect(attrs.date))) {
              validUIDs.push(inspect(attrs.uid));
            }
          });
        });
        fetch.once("error", function (err) {
          if (logs) {
            logs.onFechError(err);
          }
        });
        fetch.once("end", function () {
          if (validUIDs.length === 0) {
            imap.end();
            if (logs) {
              logs.onNoValidEmailsDiscovered();
            }
            return;
          }
          imap.openBox(rule.folderName, (openBoxError, _) => {
            if (openBoxError && forceBoxCreation === true) {
              imap.addBox(rule.folderName, _ => {
                processFn(imap, validUIDs);
              });
            }
            processFn(imap, validUIDs);
          });
        });
      });
    });
  });

  imap.once("error", function (err: Error) {
    if (logs) {
      logs.onConnectionError(err);
    }
  });

  imap.once("end", function () {
    if (logs) {
      logs.onConnectionEnd();
    }
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

export { processEmails, createConfig, moveEmails };
