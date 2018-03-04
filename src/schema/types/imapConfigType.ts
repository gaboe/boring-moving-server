import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from "graphql";
import { UserType } from "./UserType";
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
