import { Order } from "../models/OrderModel";
import { IOrder } from "../interfaces/IOrder";
import { Item } from "../models/ItemModel";
import { IItem } from "../interfaces/IItem";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { PublishedItem } from "../models/PublishedItemModel";
import { Review } from "../models/ReviewModel";
import { IReview } from "../interfaces/IReview";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/UserModel";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
const async = require('async');


export const getReviews = (req: Request, res: Response) => {
  const searchParams = {};
  if (Object.keys(req.query).length != 0) {
    Object.keys(req.query).forEach((key) => {
      searchParams[key] = req.query[key];
    });
  }
  Review.find(searchParams, function (err: mongoose.Error, reviews: IReview[]) {
    if (err || !reviews) {
      res.status(400).send({ message: "Can't find any order" });
    } else {
      res.send(reviews);
    }
  });
};




export const postReview = (req: Request, res: Response) => {
  req.assert("id", "Invalid ID").isLength({ min: 24, max: 24 });
  req.assert("title", "Title should be of length 10-255 chars").isLength({ min: 5, max: 255 });
  req.assert("rating", "Rating should be int of range 0-5").isInt({ min: 0, max: 5 });
  req.assert("description", "Description length 25-25556 chars").isLength({ min: 5, max: 25556 });
  const errors = req.validationErrors();
  // respond with errors
  if (errors) {
    res.status(400).send(errors);
    return;
  }
  async.waterfall([
    // Search for reviewee
    function (callback) {
      User.findOne({ "_id": req.params.id },
        function (err: mongoose.Error, user: IUser) {
          if (err || !user) {
            callback("User doesn't exist");
          }
          else {
            callback(null, user);
          }
        });
    },
    // Save review
    function (user, callback) {
      const review: IReview = new Review({
        "title": req.body.title,
        "rating": req.body.rating,
        "description": req.body.description,
        "buyer": getUserIdFromJwt(req),
        "seller": user
      });
      review.save((err: mongoose.Error) => {
        if (err) {
          callback(err.message);
        } else {
          callback(null, review);
        }
      });
    }
  ],
    function (err, result) {
      if (err) {
        res.status(406).send({ "error": err });
      } else {
        res.status(200).send(result);
      }
    });
}

export const putReview = (req: Request, res: Response) => {
  req.assert("id", "Invalid ID").isLength({ min: 24, max: 24 });
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).send(errors);
    return;
  }
  Review.findOneAndUpdate({ _id: req.params.id }, req.body, function (err: mongoose.Error, review: IReview) {
    if (err || !review) {
      res.status(400).send({ message: "Can't find review to update" });
    } else {
      res.send(review);
    }
  });
}


export const deleteReview = (req: Request, res: Response) => {
  req.assert("id", "Invalid ID").isLength({ min: 24, max: 24 });
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).send(errors);
    return;
  }
  Review.findOneAndRemove({ _id: req.params.id }, req.body, function (err: mongoose.Error) {
    if (err) {
      res.status(400).send({ message: "Review doesn't exist" });
    } else {
      res.status(200).send({ "msg": "Ok" });
    }
  });
}