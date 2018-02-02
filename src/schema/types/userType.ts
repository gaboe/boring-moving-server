import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} from "graphql";
import { RuleType } from "./ruleType";
import { getUserRules } from "./../../services/RuleService";
import { IUserModel } from "./../../models/users/User";

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    rules: {
      type: new GraphQLList(RuleType),
      resolve(parentValue: IUserModel, _) {
        return getUserRules(parentValue._id);
      }
    }
  }
});

export { UserType };
