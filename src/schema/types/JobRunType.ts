import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} from "graphql";
import { UserType } from "./UserType";
import { IStat } from "../../models/stat/Stat";
import { getUserByID } from "../../services/UserService";
import { RuleType } from "./RuleType";

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
