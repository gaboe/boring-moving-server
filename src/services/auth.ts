import { User, IUserModel } from "./../models/users/User";
import { Request } from "express";
import { Error } from "mongoose";
import { IAuth } from "./../models/auth/IAuth";
import { NonAuthenificatedUser } from "../models/users/NonAuthentificatedUser";
import { userExists, getUserByGoogleID } from "./UserService";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// SerializeUser is used to provide some identifying token that can be saved
// in the users session.  We traditionally use the 'ID' for this.
passport.serializeUser((user: IUserModel, done: (error: Error, userID: string) => void) => {
  done(null, user.id);
});

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser((id: IUserModel, done: (error: Error, user: IUserModel) => void) => {
  User.findById(id, (err: Error, user: IUserModel) => {
    done(err, user);
  });
});

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
function signup({ email, password }: IAuth, req: Request) {
  const user = new User({ email, password });
  if (!email || !password) {
    throw new Error("You must provide an email and password.");
  }

  return User.findOne({ email })
    .then((existingUser: IUserModel) => {
      if (existingUser) {
        throw new Error("Email in use");
      }
      return user.save();
    })
    .then((user: IUserModel) => {
      return new Promise((resolve, reject) => {
        req.logIn(user, (err: Error) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
    });
}

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
function login({ email, password }: IAuth, req: Request) {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err: Error, user: IUserModel) => {
      if (!user) {
        reject("Invalid credentials.");
      }

      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
// passport.use(
//   new LocalStrategy(
//     { usernameField: "googleID" },
//     { password: "googleID" },
//     (googleUser: NonAuthenificatedUser, password: string, done: any) => {
//       console.log(googleUser);
//       console.log(password);
//       console.log(done);

//       User.findOne({ googleID: googleUser.googleID }, (err: any, user: any) => {
//         if (user) return done(null, user);
//         const newUser = new User({
//           email: googleUser.email,
//           firstName: googleUser.firstName,
//           lastname: googleUser.lastName,
//           googleID: googleUser.googleID
//         });
//         newUser.save();
//         return done(null, newUser);
//       });
//     }
//   )
// );

passport.use(
  new LocalStrategy(async function (googleID: string, _: never, done: (error: Error, user: IUserModel) => void) {
    const user = await getUserByGoogleID(googleID);
    return done(null, user);
  })
);

const authentificate = async (user: NonAuthenificatedUser, req: Request) => {
  if (await userExists(user.googleID)) {
    return login2(user.googleID, req);
  } else {
    const registeredUser = await register(user);
    return login2(registeredUser.googleID, req);
  }
};

const register = async (user: NonAuthenificatedUser) => {
  const newUser = new User({
    googleID: user.googleID,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });
  await newUser.save();
  return newUser;
};

const login2 = (googleID: string, req: Request) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local",
      (err: Error, user: IUserModel, _: never) => {
        if (!user) {
          reject("Invalid credentials.");
        }
        req.login(user, e => {
          resolve(user);
        });
      }
    )({ body: { username: googleID, password: "empty" } });
  });
};

export { signup, login, authentificate };
