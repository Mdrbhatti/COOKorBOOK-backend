import * as express from "express";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as compression from "compression";
import * as mongo from "connect-mongo"; // (session)
import * as session from "express-session";
import * as dotenv from "dotenv";
import mongoose = require("mongoose");
import * as lusca from "lusca";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as userController from "./controllers/UsersController";
import * as itemController from "./controllers/ItemController";
import * as orderController from "./controllers/OrderController";
import * as reviewController from "./controllers/ReviewController";
import * as pItemController from "./controllers/PublishedItemController";
const jwt = require("jsonwebtoken");
import { User } from "./models/UserModel";
import { IUser } from "./interfaces/IUser";
import { Request, Response, NextFunction } from "express";
import fileUpload = require("express-fileupload");
import expressValidator = require("express-validator");
mongoose.Promise = global.Promise;
const MongoStore = mongo(session);
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on("error", () => {
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});

const app = express();
// Log all requests
app.use(logger("dev"));
// compress responses
app.use(compression());
app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(fileUpload());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));

// JWT-Auth strategy
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const jwtOptions: any = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = process.env.SESSION_SECRET;

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload: any, next: any) {
  // Find user in db
  User.findOne({ "_id": jwt_payload.id }, function (err, user: IUser) {
    if (user) {
      next(undefined, user);
    }
    else {
      console.log("Invalid token");
      // Let middleware take care of it :)
      next(undefined, false);
    }
  });
});

passport.use(strategy);
app.use(passport.initialize());

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Define all routes here
app.use("/images", express.static("images"));
// Auth routes
app.post("/register", userController.postRegister);
app.post("/login", userController.postLogin);
app.put("/users/:id", passport.authenticate("jwt", { session: false }), userController.putUser);
app.get("/users", passport.authenticate("jwt", { session: false }), userController.getUsers);
// app.post("/items/:id/publish", passport.authenticate("jwt", { session: false }), itemController.publishItem);
// app.get("/items/published", passport.authenticate("jwt", { session: false }), itemController.getPublishedItems);
app.get("/items", passport.authenticate("jwt", { session: false }), itemController.getItems);
app.post("/items", passport.authenticate("jwt", { session: false }), itemController.postItem);
// Reviews routes
app.post("/users/:id/review", passport.authenticate("jwt", { session: false }), reviewController.postReview);
app.get("/reviews", passport.authenticate("jwt", { session: false }), reviewController.getReviews);
app.put("/reviews/:id", passport.authenticate("jwt", { session: false }), reviewController.putReview);
app.delete("/reviews/:id", passport.authenticate("jwt", { session: false }), reviewController.deleteReview);
// Manage inventory routes
app.get("/items/manage/published", passport.authenticate("jwt", { session: false }), itemController.getPublishedItemsForSeller);
app.post("/items/manage", passport.authenticate("jwt", { session: false }), itemController.updatePublishedItemsForSeller);
app.post("/items/manage/delete", passport.authenticate("jwt", { session: false }), itemController.deleteItem);
app.post("/items/manage/order/delete", passport.authenticate("jwt", { session: false }), itemController.deleteOrder);
// Actual route for published items:
app.post("/v1/pitem", passport.authenticate("jwt", { session: false }), pItemController.postItem);
app.get("/v1/pitem", passport.authenticate("jwt", { session: false }), pItemController.getItem);
// Order Routes
app.post("/v1/pitem/:id/order", passport.authenticate("jwt", { session: false }), orderController.orderItem);
app.get("/v1/order", passport.authenticate("jwt", { session: false }), orderController.getOrders);
// return image
app.get("/image/:src", pItemController.getImage);

// Disable in prodcution
app.use(errorHandler());

const server = app.listen(8000, "0.0.0.0", () => {
  const { address, port } = server.address();
  console.log("Listening on http://localhost:" + port);
});

module.exports = app;
