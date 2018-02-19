type SearchCriteria = "ALL" | "FROM" | "SUBJECT" | "BODY" | "BEFORE";

type SearchCriterias =
  | string
  | string[]
  | SearchCriteria
  | Array<SearchCriteria>
  | Array<Array<SearchCriteria> | SearchCriteria | string | string[]>
  | (string | string[])[];

export { SearchCriterias };
