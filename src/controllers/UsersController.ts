import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
const jwt = require('jsonwebtoken');
// import * as jwt from "jsonwebtoken";
import { User } from "../models/UserModel";
import { IUser } from "../interfaces/IUser";
import * as mongoose from 'mongoose';
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
const moment = require('moment');
// import * as moment from "moment";
const _ = require('underscord');
// import * as  _ from "underscore";
const request = require("express-validator");

function getUserIdFromJwt(req: Request): string{
    const jwtToken = req.get('Authorization').slice(4);
    const userId: string = (<any>jwt.decode(jwtToken)).id;
    return userId;
}
// TODO: Check for duplicates/users
export let postRegister = (req: Request, res: Response, next: NextFunction) => {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("userType", "User must have a type").len(4);
    req.assert("password", "Password must be at least 4 characters long").len(4);
    req.assert("username", "Username must be at least 4 characters long").len(4);
    const errors = req.validationErrors();
    // respond with errors
    if (errors) {
        res.status(400).send(errors);
        return;
    }

    var user: IUser = new User(_.extend(req.body, { lastLogin: new Date(), createdOn: new Date() }));
    user.save(function (err: mongoose.Error) {
        if (err) {
            res.status(400).send({ message: "Username or email already exists" });
        }
        else {
            // Return token
            var payload = { id: user.id };
            var token = jwt.sign(payload, process.env.SESSION_SECRET);
            res.json({ message: "ok", token: token });
        }
    });
};

export let postLogin = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({ username: req.body.username }, function (err: mongoose.Error, user: IUser) {
        if (err || !user) {
            res.status(400).send({ message: "Invalid username or password" });
        }
        else {
            user.comparePassword(req.body.password, function (err: any, isMatch: any) {
                if (isMatch) {
                    var payload = { id: user.id };
                    var token = jwt.sign(payload, process.env.SESSION_SECRET);
                    res.json({ message: "ok", token: token });
                    user.lastLogin = new Date();
                    user.save();
                }
                else {
                    res.status(400).send({ message: "Invalid username or password" });
                }
                // Some funky shit
                return null;
            });
        }
    });
};

export let putUser = (req: Request, res: Response, next: NextFunction) => {
    // Only a user can update his account (while logged in)
    User.findOneAndUpdate({_id: getUserIdFromJwt(req)}, req.body, function (err: mongoose.Error, user: IUser) {
        if (err || !user) {
            res.status(400).send({ message: "Can't find user to update" });
        }
        else{
            res.send(user);
        }
    });
};

export let getUser = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({username: req.headers.username}, function (err: mongoose.Error, user: IUser) {
        if (err || !user) {
            res.status(400).send({ message: "Can't find user" });
        }
        else{
            res.send(user);
        }
    });
};
