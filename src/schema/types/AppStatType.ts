import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    parseValue
} from "graphql";
import { UserType } from "./UserType";
import { IStat } from "../../models/stat/Stat";
import { getUserByID } from "../../services/UserService";
import { RuleType } from "./RuleType";
import { JobRunType } from "./JobRunType";
import { getRuleByID } from "../../services/RuleService";
import {
    getJobRunByID,
    getMostActiveRules,
    getAllMovedEmailsCount,
    getAllMovedEmailsCountForApplication
} from "../../services/StatService";
import { IMetaStat } from "../../models/stat/MetaStat";
import { RuleStatType } from "./RuleStatType";
import { Request } from "express";

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
