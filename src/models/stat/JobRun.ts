import { model, Document, Schema } from "mongoose";
import { JobRunName } from "./JobRunName";

interface IJobRun {
  dateStarted: string;
  dateFinished: string;
  name: JobRunName;

  iteration: number;
}

interface IJobRunModel extends IJobRun, Document {}

const schema = new Schema(
  {
    dateStarted: String,
    dateFinished: String,
    name: String,
    iteration: Number
  },
  { timestamps: { createdAt: "dateStarted" } }
);

const JobRun = model<IJobRunModel>("JobRun", schema);

export { IJobRun };
