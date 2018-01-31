import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

import { UserType } from "./types/userType";
import * as AuthService from "./../services/auth";
import { RuleType } from "./../schema/types/ruleType";
import { addRule } from "./../services/RuleService";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.signup({ email, password, req });
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
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req });
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
      resolve(parentValue, { userID, sender, subject, content }, req) {
        return addRule(userID, sender, subject, content);
      }
    }
  }
});

export default mutation;
