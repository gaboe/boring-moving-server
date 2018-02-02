import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} from "graphql";

import { UserType } from "./userType";
import { getByID } from "./../../services/UserService";
import { IRuleModel } from "./../../models/rules/Rule";
const RuleType = new GraphQLObjectType({
  name: "RuleType",
  fields: () => ({
    id: { type: GraphQLID },
    sender: { type: GraphQLString },
    subject: { type: GraphQLString },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue: IRuleModel) {
        return getByID(parentValue.userID);
      }
    }
  })
});

export { RuleType };
