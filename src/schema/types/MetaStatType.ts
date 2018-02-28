import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  parseValue
} from "graphql";
import { UserType } from "./UserType";
import { IStat } from "../../models/stat/Stat";
import { getUserByID } from "../../services/UserService";
import { RuleType } from "./RuleType";
import { JobRunType } from "./JobRunType";
import { getRuleByID } from "../../services/RuleService";
import {
  getJobRunByID,
  getMostActiveRules,
  getAllMovedEmailsCount
} from "../../services/StatService";
import { IMetaStat } from "../../models/stat/MetaStat";
import { RuleStatType } from "./RuleStatType";
import { Request } from "express";

const MetaStatType = new GraphQLObjectType({
  name: "MetaStatType",
  fields: {
    userID: { type: new GraphQLNonNull(GraphQLID) },
    takeRulesCount: { type: new GraphQLNonNull(GraphQLInt) },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve(parentValue: IMetaStat) {
        return getUserByID(parentValue.userID);
      }
    },
    rules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(RuleStatType))
      ),
      resolve(parentValue: IMetaStat) {
        return getMostActiveRules(
          parentValue.userID,
          parentValue.takeRulesCount
        );
      }
    },
    count: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Count of all emails moved by all rules",
      resolve(parentValue: IMetaStat) {
        return getAllMovedEmailsCount(parentValue.userID);
      }
    }
  }
});

export { MetaStatType };
