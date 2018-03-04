import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt
} from "graphql";
import { UserType } from "./UserType";
import { getUserByID } from "../../services/UserService";
import { RuleType } from "./RuleType";
import { getRuleByID } from "../../services/RuleService";

const RuleStatType = new GraphQLObjectType({
  name: "RuleStatType",
  fields: {
    ruleID: { type: new GraphQLNonNull(GraphQLID) },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    count: { type: new GraphQLNonNull(GraphQLInt) },
    rule: {
      type: new GraphQLNonNull(RuleType),
      resolve(parentValue: IRuleStat) {
        return getRuleByID(parentValue.ruleID);
      }
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve(parentValue: IRuleStat) {
        return getUserByID(parentValue.userID);
      }
    }
  }
});

export { RuleStatType };
