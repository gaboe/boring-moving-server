import { IStatModel } from "./Stat";
import { IRuleModel } from "../rules/Rule";
import { IUserModel } from "../users/User";

type IMetaStat = {
  stats: IStatModel[];
  rule: IRuleModel[];
  user: IUserModel[];
  count: number;
};

export { IMetaStat };
