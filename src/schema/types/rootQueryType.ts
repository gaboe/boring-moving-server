import * as graphql from "graphql";
import { getByID } from "./../../services/RuleService";
import UserType from "./userType";
import { RuleType } from "./ruleType";

const { GraphQLObjectType, GraphQLID, GraphQLNonNull } = graphql;
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      resolve(parentValue: any, args: any, req: any) {
        return req.user;
      }
    },
    rule: {
      type: RuleType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return getByID(id);
      }
    }
  }
});

export default RootQueryType;
