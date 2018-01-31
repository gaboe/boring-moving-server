import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphhQLInt,
  GraphQLList
} from "graphql";

import { UserType } from "./userType";
import { getByID } from "./../../services/UserService";
const RuleType = new GraphQLObjectType({
  name: "RuleType",
  fields: () => ({
    id: { type: GraphQLID },
    sender: { type: GraphQLString },
    subject: { type: GraphQLString },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return getByID(parentValue.userID);
      }
    }
  })
});

export { RuleType };
