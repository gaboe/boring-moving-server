import { User } from "./../models/users/User";
import { Rule } from "./../models/rules/Rule";

const addRule = (
  userID: string,
  sender: string,
  subject: string,
  content: string
) => {
  const rule = new Rule();
  rule.sender = sender;
  rule.subject = subject;
  rule.content = subject;

  rule.save();
};

const getByID = (id: string) => {
  return Rule.findById(id);
};
export { addRule, getByID };
