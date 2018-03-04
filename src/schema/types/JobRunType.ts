import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt
} from "graphql";

const JobRunType = new GraphQLObjectType({
  name: "JobRunType",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    dateStarted: { type: new GraphQLNonNull(GraphQLString) },
    dateFinished: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    iteration: { type: new GraphQLNonNull(GraphQLInt) }
  }
});

export { JobRunType };
