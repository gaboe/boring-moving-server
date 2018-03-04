import { model, Document, Schema } from "mongoose";

interface IRule {
  userID: string;
  sender: string;
  subject: string;
  content: string;
  folderName: string;
  period: number;
}

const ruleSchema = new Schema({
  userID: String,
  sender: String,
  subject: String,
  content: String,
  folderName: String,
  period: Number
});

interface IRuleModel extends IRule, Document { }

const Rule = model<IRuleModel>("Rule", ruleSchema);

function getRuleByID(id: string) {
  return Rule.findById(id);
}

export { Rule, getRuleByID, IRuleModel };
