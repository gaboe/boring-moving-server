import * as graphql from "graphql";
import { getRuleByID } from "./../../services/RuleService";
import { UserType } from "./UserType";
import { RuleType } from "./RuleType";
import { IRuleModel } from "./../../models/rules/Rule";
import { ImapConfigType } from "./ImapConfigType";
import { getConfigByUserID } from "../../services/ImapConfigService";
import { GraphQLInt } from "graphql";
import { IMetaStat } from "../../models/stat/MetaStat";
import { MetaStatType } from "./MetaStatType";
import { AppStatType } from "./AppStatType";
import { ApolloRequest } from "apollo-graphql-server";
import { withAuthentification } from "../../services/SecurityService";

const { GraphQLObjectType, GraphQLID, GraphQLNonNull } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      resolve(_, __, { req }: ApolloRequest) {
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
      resolve(_, __, { req }: ApolloRequest) {
        return withAuthentification(req, (id) => getConfigByUserID(id));
      }
    },
    mostActiveRules: {
      type: MetaStatType,
      args: { count: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve(_, { count }: { count: number }, { req }: ApolloRequest) {
        return withAuthentification(req, (id) => {
          const metaStat: IMetaStat = {
            userID: id,
            takeRulesCount: count
          };
          return metaStat;
        });
      }
    },
    appStat: {
      type: new GraphQLNonNull(AppStatType),
      resolve() {
        return {};
      }
    }
  }
});

export default RootQueryType;
