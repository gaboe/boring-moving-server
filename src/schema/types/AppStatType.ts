import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
} from "graphql";
import {
    getAllMovedEmailsCountForApplication
} from "../../services/StatService";

const AppStatType = new GraphQLObjectType({
    name: "AppStatType",
    fields: {
        emailCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "Count of all emails moved by all application",
            resolve(_) {
                return getAllMovedEmailsCountForApplication();
            }
        }
    }
});

export { AppStatType };
