import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

import { UserType } from "./types/userType";
import * as AuthService from "./../services/auth";
import { RuleType } from "./../schema/types/ruleType";
import { addRule } from "./../services/RuleService";
import { IUserModel } from "./../models/users/User";
import { Request } from "express";
import { IAuth } from "./../models/auth/IAuth";
import { IRuleModel } from "./../models/rules/Rule";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
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
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, { email, password }: IAuth, req: Request) {
        return AuthService.login({ email, password }, req);
      }
    },
    addRule: {
      type: RuleType,
      args: {
        userID: { type: GraphQLID },
        sender: { type: GraphQLString },
        subject: { type: GraphQLString },
        content: { type: GraphQLString }
      },
      resolve(_, { userID, sender, subject, content }: IRuleModel) {
        return addRule(userID, sender, subject, content);
      }
    }
  }
});

export default mutation;
