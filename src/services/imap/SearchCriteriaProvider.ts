import { append } from "ramda";
import * as moment from "moment";
import { SearchCriterias } from "./SearchCriteria";
import { IRuleModel } from "../../models/rules/Rule";

const createSearchCriteria = (rule: IRuleModel): SearchCriterias => {
  let base = ["ALL", ["FROM", rule.sender]];
  if (rule.subject) {
    base = append(["SUBJECT", rule.subject], base);
  }
  if (rule.content) {
    base = append(["BODY", rule.subject], base);
  }

  return base;
};

export { createSearchCriteria };
