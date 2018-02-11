import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import { Error, Schema, Document, model } from "mongoose";
import { Rule } from "./../rules/Rule";
import { ObjectId } from "bson";
import { IUser } from "./IUser";

interface IUserModel extends IUser, Document {}

const userSchema = new Schema({
  googleID: String,
  email: String,
  firstName: String,
  lastName: String
});

userSchema.pre("save", function save(next) {
  const user: IUserModel = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(
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

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = model<IUserModel>("User", userSchema);

export { User, userSchema, IUserModel };
