import { JobRunName } from "../models/stat/JobRunName";
import { IJobRun, JobRun, IJobRunModel } from "../models/stat/JobRun";
import { nameof } from "../utils/Reflection";
import { IStatModel, IStat, Stat } from "../models/stat/Stat";
import * as R from "ramda";
import { IMetaStat } from "../models/stat/MetaStat";
import { getUserByID } from "./UserService";
import { getRuleByID } from "../models/rules/Rule";
import { IAppStat } from "../models/stat/AppStat";

const createJobRun = async (name: JobRunName): Promise<IJobRunModel> => {
  const _jobRun: IJobRun = {
    name,
    dateFinished: null,
    dateStarted: null,
    iteration: await getLastIteration(name)
  };
  const jobRun = new JobRun(_jobRun);
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

const getJobRunByID = async (jobRunID: string) => {
  return await JobRun.findById(jobRunID);
};

const getAllMovedEmailsCount = async (userID: string) => {
  const userStats = await Stat.find({ userID });
  const count = userStats.map(x => x.movedEmailsCount).reduce((a, b) => a + b);
  return count;
};

const getAllMovedEmailsCountForApplication = async () => {
  const appStats: IAppStat[] = await Stat.aggregate([
    { $group: { _id: null, emailCount: { $sum: "$movedEmailsCount" } } }
  ]);
  return appStats.map(x => x.emailCount).reduce((a, b) => a + b);
};

// TODO try refactor this using rxjs
const getMostActiveRules = async (userID: string, count: number) => {
  const userStats = await Stat.find({ userID });
  const grouped = R.groupBy(x => x.ruleID, userStats);

  const calculated: { ruleID: string; count: number } = R.map(x => {
    return x.map(e => e.movedEmailsCount).reduce((a, b) => a + b);
  }, grouped);

  const arrayOfCalculated = Object.entries(calculated).map(x => {
    const metaStat: IRuleStat = {
      userID: userID,
      ruleID: x[0],
      count: Number(x[1])
    };
    return metaStat;
  });

  return R.sortBy(x => !x.count, R.take(count, arrayOfCalculated));
};

export {
  getJobRunByID,
  createJobRun,
  setCurrentJobAsFinished,
  insertMovedEmailsStat,
  getMostActiveRules,
  getAllMovedEmailsCount,
  getAllMovedEmailsCountForApplication
};
