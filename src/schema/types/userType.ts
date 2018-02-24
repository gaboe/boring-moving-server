import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from "graphql";
import { RuleType } from "./ruleType";
import { getUserRules } from "./../../services/RuleService";
import { IUserModel } from "./../../models/users/User";

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    googleID: { type: new GraphQLNonNull(GraphQLString) },
    rules: {
      type: new GraphQLList(RuleType),
      resolve(parentValue: IUserModel) {
        return getUserRules(parentValue.id);
      }
    }
  }
});

export { UserType };
