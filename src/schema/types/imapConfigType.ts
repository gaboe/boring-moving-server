import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
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
    id: { type: GraphQLID },
    userID: { type: GraphQLID },
    userName: { type: GraphQLString },
    password: { type: GraphQLString },
    host: { type: GraphQLString },
    port: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue: IImapConfigModel) {
        return getUserByID(parentValue.userID);
      }
    }
  }
});

export { ImapConfigType };
