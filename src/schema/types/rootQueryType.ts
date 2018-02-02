import * as graphql from "graphql";
import { getByID } from "./../../services/RuleService";
import { UserType } from "./userType";
import { RuleType } from "./ruleType";
import { Request } from "express";
import { IRuleModel } from "./../../models/rules/Rule";

const { GraphQLObjectType, GraphQLID, GraphQLNonNull } = graphql;
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      resolve(_, __, req: Request) {
        return req.user;
      }
    },
    rule: {
      type: RuleType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, { id }: IRuleModel) {
        return getByID(id);
      }
    }
  }
});

export default RootQueryType;
