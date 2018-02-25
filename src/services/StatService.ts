import { JobRunName } from "../models/stat/JobRunName";
import { IJobRun, JobRun, IJobRunModel } from "../models/stat/JobRun";
import { nameof } from "../utils/Reflection";
import { IStatModel, IStat, Stat } from "../models/stat/Stat";
const createJobRun = async (name: JobRunName): Promise<IJobRunModel> => {
  const jobRun = new JobRun({
    name: name,
    dateFinished: null,
    iteration: await getLastIteration(name)
  });
  jobRun.save();
  return jobRun;
};

const getLastIteration = async (name: JobRunName): Promise<number> => {
  const job: IJobRunModel = await JobRun.findOne().sort({ iteration: -1 });
  if (job) {
    return job.iteration + 1;
  }
  return 0;
};

const setCurrentJobAsFinished = async (jobRunID: string) => {
  return await JobRun.findByIdAndUpdate(
    jobRunID,
    { $set: { dateFinished: new Date() } },
    { new: true }
  );
};

const insertMovedEmailsStat = async (
  jobRunID: string,
  userID: string,
  ruleID: string,
  count: number
) => {
  const _stat: IStat = {
    userID,
    dateCreated: "",
    ruleID,
    movedEmailsCount: count,
    jobRunID
  };
  const stat = new Stat(_stat);
  stat.save();
  return stat;
};

export { createJobRun, setCurrentJobAsFinished, insertMovedEmailsStat };
