import { IRule } from "./../rules/IRule";

interface IUser {
  email: string;
  password: string;

  rules: IRule[];

  comparePassword(
    password: string,
    callback: (err: Error, isMatch: boolean) => void
  ): boolean;
}

export { IUser };
