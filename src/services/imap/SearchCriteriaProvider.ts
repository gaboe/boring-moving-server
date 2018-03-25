import { append } from "ramda";
import { SearchCriterias } from "./SearchCriteria";
import { IRule } from "../../models/rules/Rule";

const createSearchCriteria = (rule: IRule): SearchCriterias => {
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
