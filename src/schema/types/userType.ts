import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} from "graphql";
import { RuleType } from "./RuleType";
import { getUserRules } from "./../../services/RuleService";
import { IUserModel } from "./../../models/users/User";
import { ImapConfigType } from "./ImapConfigType";
import { getConfigByUserID, hasCompleteImapConfig } from "../../services/ImapConfigService";

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    googleID: { type: new GraphQLNonNull(GraphQLString) },
    rules: {
      type: new GraphQLList(new GraphQLNonNull(RuleType)),
      resolve(parentValue: IUserModel) {
        return getUserRules(parentValue.id);
      }
    },
    imapConfig: {
      type: ImapConfigType,
      resolve(parentValue: IUserModel) {
        return getConfigByUserID(parentValue.id);
      }
    },
    hasCompleteImapConfig: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(parentValue: IUserModel) {
        return hasCompleteImapConfig(parentValue.id);
      }
    }
  })
});

export { UserType };
