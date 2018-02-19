import { IRule } from "./../rules/IRule";
import { IAuth } from "./../auth/IAuth";
import { NonAuthenificatedUser } from "./NonAuthentificatedUser";
import { IImapConfig } from "./IImapConfig";
interface IUser extends IAuth, NonAuthenificatedUser {
  password: string;

  rules: IRule[];
  imapConfig: IImapConfig;
  comparePassword(
    password: string,
    callback: (err: Error, isMatch: boolean) => void
  ): boolean;
}

export { IUser };
