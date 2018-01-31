import * as graphql from "graphql";
import { RuleType } from "./ruleType";

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    rules: { type: RuleType }
  }
});

export default UserType;
