import * as bcrypt from "bcrypt-nodejs";
import { Schema, Document, model } from "mongoose";
import { IRuleModel } from "./../rules/Rule";
import { IAuth } from "../auth/IAuth";
import { NonAuthenificatedUser } from "./NonAuthentificatedUser";
import { IImapConfigModel } from "./ImapConfig";

interface IUser extends IAuth, NonAuthenificatedUser {
  password: string;
  rules: IRuleModel[];
  imapConfig: IImapConfigModel;
  comparePassword(
    password: string,
    callback: (err: Error, isMatch: boolean) => void
  ): boolean;
}

interface IUserModel extends IUser, Document { }

const userSchema = new Schema({
  googleID: String,
  email: String,
  firstName: String,
  lastName: String
});

userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: (err: Error, isMatch: boolean) => void
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: Error, isMatch: boolean) => {
      callback(err, isMatch);
    }
  );
};

const User = model<IUserModel>("User", userSchema);

export { User, userSchema, IUserModel };
