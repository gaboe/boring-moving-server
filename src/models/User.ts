import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import { ruleSchema, Rule } from "./Rule";
import { ObjectId } from "bson";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  rules: [ruleSchema]
});

userSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
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
  callback: (err: any, isMatch: any) => {}
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: mongoose.Error, isMatch: boolean) => {
      callback(err, isMatch);
    }
  );
};

userSchema.methods.addRule = function(rule: any) {
  const user = this;
  console.log("hello", user);
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;
