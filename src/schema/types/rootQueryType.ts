import * as graphql from "graphql";
import { getRuleByID } from "./../../services/RuleService";
import { UserType } from "./userType";
import { RuleType } from "./ruleType";
import { Request } from "express";
import { IRuleModel } from "./../../models/rules/Rule";
import { ImapConfigType } from "./imapConfigType";
import { getConfigByUserID } from "../../services/ImapConfigService";

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
        return getRuleByID(id);
      }
    },
    imapConfig: {
      type: ImapConfigType,
      resolve(_, __, req: Request) {
        return getConfigByUserID(req.user.id);
      }
    }
  }
});

export default RootQueryType;
