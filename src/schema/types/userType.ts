import * as graphql from "graphql";
import { RuleType } from "./ruleType";
import { getUserRules } from "./../../services/RuleService";
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    rules: {
      type: new GraphQLList(RuleType),
      resolve(parentValue: any, _) {
        return getUserRules(parentValue._id);
      }
    }
  }
});

export default UserType;
