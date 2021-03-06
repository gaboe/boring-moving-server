import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from "graphql";

import { UserType } from "./types/UserType";
import * as AuthService from "./../services/Auth";
import { RuleType } from "./../schema/types/RuleType";
import { addRule, deleteRule, updateRule } from "./../services/RuleService";
import { IAuth } from "./../models/auth/IAuth";
import { IRuleModel } from "./../models/rules/Rule";
import { GraphQLInt, GraphQLID } from "graphql/type/scalars";
import { NonAuthenificatedUser } from "../models/users/NonAuthentificatedUser";
// import { logInfo } from "../services/LogService";
import { ImapConfigType } from "./types/ImapConfigType";
import { saveImapConfig } from "../services/ImapConfigService";
import { IImapConfigModel } from "../models/users/ImapConfig";
import { ApolloRequest } from "apollo-graphql-server";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    authentificate: {
      type: UserType,
      args: {
        googleID: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) }
      },
      // tslint:disable-next-line:no-any
      resolve(_, user: NonAuthenificatedUser, { req }: ApolloRequest) {
        // console.log("Express request", req.req.login);
        // logInfo("Authentificate mutation", { req }, req.user);
        return AuthService.authentificate(user, req);
      }
    },
    signup: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { email, password }: IAuth, { req }: ApolloRequest) {
        return AuthService.signup({ email, password }, req);
      }
    },
    logout: {
      type: UserType,
      resolve(_, __, { req }: ApolloRequest) {
        const { user } = req;
        req.logout();
        return user;
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { email, password }: IAuth, { req }: ApolloRequest) {
        return AuthService.login({ email, password }, req);
      }
    },
    addRule: {
      type: RuleType,
      args: {
        sender: { type: new GraphQLNonNull(GraphQLString) },
        subject: { type: GraphQLString },
        content: { type: GraphQLString },
        folderName: { type: new GraphQLNonNull(GraphQLString) },
        period: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(
        _,
        { sender, subject, content, folderName, period }: IRuleModel,
        { req }: ApolloRequest) {
        return addRule(sender, subject, content, folderName, period, req);
      }
    },
    deleteRule: {
      type: RuleType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: "Id of rule, which will be deleted"
        }
      },
      async resolve(_, { id }: { id: string }, { req }: ApolloRequest) {
        return await deleteRule(id, req.user.id);
      }
    },
    saveImapConfig: {
      type: new GraphQLNonNull(ImapConfigType),
      args: {
        userName: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        host: { type: new GraphQLNonNull(GraphQLString) },
        port: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(
        _,
        { userName, password, host, port }: IImapConfigModel,
        { req }: ApolloRequest
      ) {
        return saveImapConfig(userName, password, host, port, req);
      }
    },
    updateRule: {
      type: RuleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID), description: "RuleID" },
        sender: { type: new GraphQLNonNull(GraphQLString) },
        subject: { type: GraphQLString },
        content: { type: GraphQLString },
        folderName: { type: new GraphQLNonNull(GraphQLString) },
        period: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(
        _,
        rule: IRuleModel,
        { req }: ApolloRequest
      ) {
        return await updateRule(rule, req);
      }
    },
  }
});


export default mutation;
