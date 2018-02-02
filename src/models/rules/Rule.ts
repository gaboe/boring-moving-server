import * as mongoose from "mongoose";

import { IRule } from "./IRule";
import { Strategy } from "passport-facebook";

interface IRuleModel extends IRule, mongoose.Document {}

const ruleSchema = new mongoose.Schema({
  sender: String,
  subject: String,
  content: String,
  period: Number,
  userID: String
});

const Rule = mongoose.model<IRuleModel>("Rule", ruleSchema);

function getRuleByID(id: string) {
  return Rule.findById(id);
}

export { Rule, getRuleByID, IRuleModel };
