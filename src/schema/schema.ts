import * as graphql from "graphql";
import mutation from "./mutations";
import RootQueryType from "./types/rootQueryType";

const { GraphQLSchema } = graphql;


const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation
});

export default schema;
