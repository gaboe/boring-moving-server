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
import { IMetaStat } from "../../models/stat/MetaStat";

const MetaStatType = new GraphQLObjectType({
  name: "MetaStatType",
  fields: {
    ruleID: { type: new GraphQLNonNull(GraphQLID) },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    rule: {
      type: new GraphQLNonNull(RuleType),
      resolve(parentValue: IMetaStat) {
        return getRuleByID(parentValue.ruleID);
      }
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve(parentValue: IMetaStat) {
        return getUserByID(parentValue.userID);
      }
    }
  }
});

export { MetaStatType };
