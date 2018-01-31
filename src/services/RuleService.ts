import { User } from "./../models/users/User";
import { Rule } from "./../models/rules/Rule";

const addRule = (
  userID: string,
  sender: string,
  subject: string,
  content: string
) => {
  const rule = new Rule({ userID, sender, subject, content });

  rule.save();
  return rule;
};

const getByID = (id: string) => {
  return Rule.findById(id);
};

const getUserRules = (userID: string) => {
  return Rule.find({ userID: userID }, (err, res) => {
    console.log(res);
    return res;
  });
};

export { addRule, getByID, getUserRules };
