import { IRule } from "./../rules/IRule";
import { IAuth } from "./../auth/IAuth";
interface IUser extends IAuth {
  email: string;
  password: string;

  rules: IRule[];

  comparePassword(
    password: string,
    callback: (err: Error, isMatch: boolean) => void
  ): boolean;
}

export { IUser };
