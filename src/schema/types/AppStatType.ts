import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
} from "graphql";
import {
    getAllMovedEmailsCountForApplication
} from "../../services/StatService";
import { IMetaStat } from "../../models/stat/MetaStat";

const AppStatType = new GraphQLObjectType({
    name: "AppStatType",
    fields: {
        emailCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "Count of all emails moved by all application",
            resolve(parentValue: IMetaStat) {
                return getAllMovedEmailsCountForApplication();
            }
        }
    }
});

export { AppStatType };
