/**
 * Module dependencies.
 */
import * as express from "express";
import * as compression from "compression"; // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as mongo from "connect-mongo";
import * as flash from "express-flash";
import * as path from "path";
import * as mongoose from "mongoose";
import * as passport from "passport";
import expressValidator = require("express-validator");
import * as homeController from "./controllers/Home";
// import * as expressGraphQL from "express-graphql";
import schema from "./schema/Schema";
import * as cors from "cors";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
const { ApolloEngine } = require("apollo-engine");
const MongoStore = mongo(session);
(<{ Promise: Function }>mongoose).Promise = global.Promise;
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

/**
 * Create Express server.
 */
const app = express();

console.log(
  `\nAllowing connections from: ${process.env.ALLOWED_CLIENT_ORIGIN}`
);
// cors has to be up here
const corsOptions = {
  origin: process.env.ALLOWED_CLIENT_ORIGIN, // TODO add enviroments
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true // <-- REQUIRED backend setting
};

app.options("*", cors(corsOptions)); // enable pre-flight request for DELETE request

app.use(cors(corsOptions));

/**
 * Connect to MongoDB.
 */
const mongoURL = process.env.MONGOLAB_URI || process.env.MONGODB_URI;
console.log(`\nConnecting to db: ${mongoURL}\n`);

if (mongoURL) {
  mongoose.connect(mongoURL);
}
else {
  console.log(`Missing MONGOLAB_URI or MONGODB_URI from config`);
  process.exit();
}

mongoose.connection.on("error", e => {
  console.log(`MongoDB connection error: ${e}`);
  process.exit();
});

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
if (process.env.SESSION_SECRET && mongoURL) {
  app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({
        url: mongoURL,
        autoReconnect: true
      })
    })
  );
}
else {
  console.log(`Missing SESSION_SECRET or MONGO_URL from config`);
  process.exit();
}

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/**
 * Primary app routes.
 */
app.get("/", homeController.index);
app.get("/job", homeController.startJob);

app.use("/graphql", bodyParser.json(), graphqlExpress(req => {
  return {
    context: {
      req,
    },
    schema,
    tracing: true,
    cacheControl: true,
  };
}));

app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })); // if you want GraphiQL enabled

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

if (process.env.APOLLO_ENGINE_SECRET) {
  const engine = new ApolloEngine({
    apiKey: process.env.APOLLO_ENGINE_SECRET
  });
  engine.listen({
    port: process.env.PORT || 3000,
    expressApp: app,
  });
}
else {
  console.error(`Missing APOLLO_ENGINE_SECRET from config`);
  process.exit();
}

/**
 * Start Express server.
 */
// app.listen(app.get("port"), () => {
//   console.log(
//     "App is running at http://localhost:%d in %s mode",
//     app.get("port"),
//     app.get("env")
//   );
//   console.log("Press CTRL-C to stop\n");
// });

module.exports = app;
