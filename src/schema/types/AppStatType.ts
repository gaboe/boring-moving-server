import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
} from "graphql";
import {
    getAllMovedEmailsCountForApplication
} from "../../services/StatService";
import { ApolloRequest } from "apollo-graphql-server";
import { IRuleModel } from "../../models/rules/Rule";
import { withAuthentification } from "../../services/SecurityService";
import { processEmails, createConfig } from "../../services/imap/ImapService";
import { getConfigByUserID } from "../../services/ImapConfigService";

const AppStatType = new GraphQLObjectType({
    name: "AppStatType",
    fields: {
        emailCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "Count of all emails moved by all application",
            resolve() {
                return getAllMovedEmailsCountForApplication();
            }
        },
        emailsMovedByRule: {
            type: GraphQLInt,
            args: {
                sender: { type: new GraphQLNonNull(GraphQLString) },
                subject: { type: GraphQLString },
                content: { type: GraphQLString },
                folderName: { type: new GraphQLNonNull(GraphQLString) },
                period: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(_, { sender, subject, content, folderName, period }: IRuleModel, { req }: ApolloRequest) {
                return withAuthentification(req, async (userID) => {
                    const config = await getConfigByUserID(userID);
                    if (!config) {
                        return null;
                    }
                    return new Promise((resolver, reject) => {
                        processEmails(createConfig(config), { userID, sender, subject, content, folderName, period }, (_, uids) => {
                            return resolver(uids.length);
                        }, {
                                onConnectionEnd: () => undefined,
                                onConnectionError: (err) => reject(`Problem with connection ${err}`),
                                onFechError: (err) => reject(`Problem with fetching emails ${err}`),
                                onNoValidEmailsDiscovered: () => resolver(0),
                                onSearchCriteriasCreated: () => undefined
                            });
                    });
                });
            }
        }
    }
});

export { AppStatType };
