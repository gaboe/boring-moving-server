import { Schema, Document, model } from "mongoose";
import { encryptImapConfig } from "../../services/SecurityService";

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

imapConfigSchema.pre("save", function (this: IImapConfigModel, next) {
  this.password = encryptImapConfig(this).password;
  next();
});

interface IImapConfigModel extends IImapConfig, Document { }

const ImapConfig = model<IImapConfigModel>("ImapConfig", imapConfigSchema);

export { ImapConfig, IImapConfigModel, IImapConfig };
