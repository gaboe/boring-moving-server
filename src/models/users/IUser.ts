import { IRule } from "./../rules/IRule";

interface IUser {
  email: string;
  password: string;

  rules: IRule[];
}

export { IUser };
