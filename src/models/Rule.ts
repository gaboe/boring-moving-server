import * as mongoose from "mongoose";
import { ObjectId } from "bson";

const ruleSchema = new mongoose.Schema({
  sender: String,
  subject: String,
  content: String,
  period: Number
});

const Rule = mongoose.model("Rule", ruleSchema);

export { ruleSchema, Rule };
