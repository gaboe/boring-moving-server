import { model, Document, Schema } from "mongoose";

import { IRule } from "./IRule";
import { Strategy } from "passport-facebook";

interface IRuleModel extends IRule, Document {}

const ruleSchema = new Schema({
  sender: String,
  subject: String,
  content: String,
  period: Number,
  userID: String
});

const Rule = model<IRuleModel>("Rule", ruleSchema);

function getRuleByID(id: string) {
  return Rule.findById(id);
}

export { Rule, getRuleByID, IRuleModel };
