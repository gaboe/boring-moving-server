import { Schema, Document, model } from "mongoose";

interface IImapConfig {
  userID: string;
  userName: string;
  password: string;
  host: string;
  port: number;
}

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
interface IImapConfigModel extends IImapConfig, Document { }

const ImapConfig = model<IImapConfigModel>("ImapConfig", imapConfigSchema);

export { ImapConfig, IImapConfigModel, IImapConfig };
