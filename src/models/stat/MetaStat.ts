import { IStatModel } from "./Stat";
import { IRuleModel } from "../rules/Rule";
import { IUserModel } from "../users/User";

type IMetaStat = {
  userID: string;
  takeRulesCount: number;
};

export { IMetaStat };
