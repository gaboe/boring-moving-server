import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from "graphql";

import { UserType } from "./UserType";
import { getUserByID } from "./../../services/UserService";
import { IRuleModel } from "./../../models/rules/Rule";
import { GraphQLInt } from "graphql/type/scalars";
const RuleType = new GraphQLObjectType({
  name: "RuleType",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    sender: { type: new GraphQLNonNull(GraphQLString) },
    subject: { type: GraphQLString },
    content: { type: GraphQLString },
    folderName: { type: new GraphQLNonNull(GraphQLString) },
    period: { type: new GraphQLNonNull(GraphQLInt) },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve(parentValue: IRuleModel) {
        return getUserByID(parentValue.userID);
      }
    }
  })
});

export { RuleType };
