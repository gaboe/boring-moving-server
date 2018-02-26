import { IStatModel } from "./Stat";
import { IRuleModel } from "../rules/Rule";
import { IUserModel } from "../users/User";

type IMetaStat = {
  rule?: IRuleModel;
  ruleID: string;
  user?: IUserModel;
  userID: string;
  count: number;
};

export { IMetaStat };
