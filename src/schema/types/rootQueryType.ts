import * as graphql from "graphql";
import { getRuleByID } from "./../../services/RuleService";
import { UserType } from "./userType";
import { RuleType } from "./ruleType";
import { Request } from "express";
import { IRuleModel } from "./../../models/rules/Rule";
import { ImapConfigType } from "./imapConfigType";
import { getConfigByUserID } from "../../services/ImapConfigService";
import { getMostActiveRules } from "../../services/StatService";
import { MetaStatType } from "./MetaStatType";
import { GraphQLInt } from "graphql";

const { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLList } = graphql;

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
    },
    mostActiveRules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(MetaStatType))
      ),
      args: { count: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve(_, { count }: { count: number }, req: Request) {
        return getMostActiveRules(req.user.id, count);
      }
    }
  }
});

export default RootQueryType;
