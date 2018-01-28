import * as  graphql from "graphql";

import UserType from "./userType";

const { GraphQLObjectType, GraphQLID } = graphql;
const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            resolve(parentValue: any, args: any, req: any) {
                return req.user;
            }
        }
    }
});

export default RootQueryType;
