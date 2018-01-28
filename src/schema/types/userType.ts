import * as  graphql from "graphql";

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID
} = graphql;

const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: {
        id: { type: GraphQLID },
        email: { type: GraphQLString }
    }
});

export default UserType;