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
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    googleID: { type: GraphQLString },
    rules: {
      type: new GraphQLList(RuleType),
      resolve(parentValue: IUserModel) {
        return getUserRules(parentValue.id);
      }
    }
  }
});

export { UserType };
