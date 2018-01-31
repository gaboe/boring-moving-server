import * as mongoose from "mongoose";

import { IRule } from "./IRule";

interface IRuleModel extends IRule, mongoose.Document {}

const ruleSchema = new mongoose.Schema({
  sender: String,
  subject: String,
  content: String,
  period: Number
});

const Rule = mongoose.model<IRuleModel>("Rule", ruleSchema);

export { Rule };
