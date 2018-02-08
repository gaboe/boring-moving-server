import { User, IUserModel } from "./../models/users/User";
import { Rule } from "./../models/rules/Rule";
import { Request } from "express";

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

const getByID = (id: string) => {
  return Rule.findById(id);
};

const getUserRules = (userID: string) => {
  return Rule.find({ userID: userID }, (err, res) => {
    return res;
  });
};

export { addRule, getByID, getUserRules };
