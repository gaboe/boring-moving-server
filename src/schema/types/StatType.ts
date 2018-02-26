import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from "graphql";
import { UserType } from "./UserType";
import { IStat } from "../../models/stat/Stat";
import { getUserByID } from "../../services/UserService";
import { RuleType } from "./RuleType";
import { JobRunType } from "./JobRunType";
import { getRuleByID } from "../../services/RuleService";
import { getJobRunByID } from "../../services/StatService";

const StatType = new GraphQLObjectType({
  name: "StatType",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    jobRunID: { type: new GraphQLNonNull(GraphQLID) },
    ruleID: { type: new GraphQLNonNull(GraphQLID) },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    rule: {
      type: new GraphQLNonNull(RuleType),
      resolve(parentValue: IStat) {
        return getRuleByID(parentValue.ruleID);
      }
    },
    jobRun: {
      type: new GraphQLNonNull(JobRunType),
      resolve(parentValue: IStat) {
        return getJobRunByID(parentValue.jobRunID);
      }
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve(parentValue: IStat) {
        return getUserByID(parentValue.userID);
      }
    }
  }
});

export { StatType };
