import { Rule, IRuleModel } from "./../models/rules/Rule";
import { Request } from "express";
import { logInfo } from "./LogService";

const addRule = (
  sender: string,
  subject: string,
  content: string,
  folderName: string,
  period: number,
  req: Request
) => {
  const { user } = req;
  const rule = new Rule({
    userID: user.id,
    sender,
    subject,
    content,
    folderName,
    period
  });

  rule.save();
  return rule;
};

const getRuleByID = (id: string) => {
  return Rule.findById(id);
};

const getUserRules = (userID: string) => {
  return Rule.find({ userID: userID }, (_, res) => {
    return res;
  });
};

const deleteRule = async (ruleID: string, userID: string) => {
  const rule = await Rule.findByIdAndRemove(ruleID);
  logInfo("Rule deleted", { ruleID: ruleID, rule }, userID);
  return rule;
};

const updateRule = async (rule: IRuleModel, req: Request) => {
  rule.userID = req.user && req.user.id;
  await Rule.findByIdAndUpdate(rule.id, rule);
  return Rule.findById(rule.id);
};

export { addRule, getRuleByID, getUserRules, deleteRule, updateRule };
