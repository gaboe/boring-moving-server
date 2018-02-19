import * as bcrypt from "bcrypt-nodejs";
import { Error, Schema, Document, model } from "mongoose";
import { IImapConfig } from "./IImapConfig";

interface IImapConfigModel extends IImapConfig, Document {}

const imapConfigSchema = new Schema({
  userID: String,
  userName: String,
  password: String,
  host: String,
  port: Number
});

// imapConfigSchema.pre("save", function save(next) {
//   const config: IImapConfigModel = this;
//   if (!config.isModified("password")) {
//     return next();
//   }
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return next(err);
//     }
//     bcrypt.hash(config.password, salt, undefined, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       config.password = hash;
//       next();
//     });
//   });
// });

const ImapConfig = model<IImapConfigModel>("ImapConfig", imapConfigSchema);

export { ImapConfig };
