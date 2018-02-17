import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} from "graphql";

import { UserType } from "./userType";
import { getUserByID } from "./../../services/UserService";
import { IRuleModel } from "./../../models/rules/Rule";
import { GraphQLInt } from "graphql/type/scalars";
const RuleType = new GraphQLObjectType({
  name: "RuleType",
  fields: () => ({
    id: { type: GraphQLID },
    sender: { type: GraphQLString },
    subject: { type: GraphQLString },
    content: { type: GraphQLString },
    folderName: { type: GraphQLString },
    period: { type: GraphQLInt },
    userID: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue: IRuleModel) {
        return getUserByID(parentValue.userID);
      }
    }
  })
});

export { RuleType };
