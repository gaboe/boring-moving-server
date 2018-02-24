import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from "graphql";
import { RuleType } from "./ruleType";
import { getUserRules } from "./../../services/RuleService";
import { IUserModel } from "./../../models/users/User";
import { UserType } from "./userType";
import { getUserByID } from "../../services/UserService";
import { IImapConfigModel } from "../../models/users/ImapConfig";

const ImapConfigType = new GraphQLObjectType({
  name: "ImapConfigType",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    userName: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    host: { type: new GraphQLNonNull(GraphQLString) },
    port: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve(parentValue: IImapConfigModel) {
        return getUserByID(parentValue.userID);
      }
    }
  }
});

export { ImapConfigType };
