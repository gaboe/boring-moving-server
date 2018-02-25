import { model, Document, Schema } from "mongoose";

interface IStat {
  dateCreated: string;
  jobRunID: string;
  ruleID: string;
  userID: string;
  movedEmailsCount: number;
}

interface IStatModel extends IStat, Document {}

const schema = new Schema(
  {
    dateCreated: String,
    jobRunID: String,
    ruleID: String,
    userID: String,
    movedEmailsCount: Number
  },
  { timestamps: { createdAt: "dateCreated" } }
);

const Stat = model<IStatModel>("Stat", schema);

export { Stat, IStatModel, IStat };
