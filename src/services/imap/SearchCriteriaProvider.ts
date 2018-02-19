import { IRule } from "../../models/rules/IRule";
import { append } from "ramda";
import * as moment from "moment";
import { SearchCriterias } from "./SearchCriteria";

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
