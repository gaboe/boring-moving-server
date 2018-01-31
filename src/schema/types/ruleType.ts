import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphhQLInt
} from "graphql";

const RuleType = new GraphQLObjectType({
  name: "RuleType",
  fields: {
    id: { type: GraphQLID },
    sender: { type: GraphQLString },
    subject: { type: GraphQLString },
    content: { type: GraphQLString }
  }
});

export { RuleType };
