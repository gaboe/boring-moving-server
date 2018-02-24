import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from "graphql";

import { UserType } from "./types/userType";
import * as AuthService from "./../services/auth";
import { RuleType } from "./../schema/types/ruleType";
import { addRule } from "./../services/RuleService";
import { IUserModel } from "./../models/users/User";
import { Request } from "express";
import { IAuth } from "./../models/auth/IAuth";
import { IRuleModel } from "./../models/rules/Rule";
import { GraphQLInt } from "graphql/type/scalars";
import { NonAuthenificatedUser } from "../models/users/NonAuthentificatedUser";
import { logInfo } from "../services/LogService";
import { ImapConfigType } from "./types/imapConfigType";
import { saveImapConfig } from "../services/ImapConfigService";
import { IImapConfigModel } from "../models/users/ImapConfig";

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
      resolve(_, user: NonAuthenificatedUser, req: Request) {
        logInfo("authentificate mutation", { user }, req.user);
        return AuthService.authentificate(user, req);
      }
    },
    signup: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { email, password }: IAuth, req: Request) {
        return AuthService.signup({ email, password }, req);
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
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
      resolve(_, { email, password }: IAuth, req: Request) {
        return AuthService.login({ email, password }, req);
      }
    },
    addRule: {
      type: RuleType,
      args: {
        sender: { type: new GraphQLNonNull(GraphQLString) },
        subject: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        folderName: { type: new GraphQLNonNull(GraphQLString) },
        period: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(
        _,
        { sender, subject, content, folderName, period }: IRuleModel,
        req: Request
      ) {
        return addRule(sender, subject, content, folderName, period, req);
      }
    },
    saveImapConfig: {
      type: ImapConfigType,
      args: {
        userName: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        host: { type: new GraphQLNonNull(GraphQLString) },
        port: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(
        _,
        { userName, password, host, port }: IImapConfigModel,
        req: Request
      ) {
        return saveImapConfig(userName, password, host, port, req);
      }
    }
  }
});

export default mutation;
