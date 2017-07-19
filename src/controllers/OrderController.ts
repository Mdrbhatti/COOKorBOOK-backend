import { Order } from "../models/OrderModel";
import { IOrder } from "../interfaces/IOrder";
import { Item } from "../models/ItemModel";
import { IItem } from "../interfaces/IItem";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { PublishedItem } from "../models/PublishedItemModel";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
const async = require('async');

export const getOrders = (req: Request, res: Response) => {
  const searchParams = {};
  if (Object.keys(req.query).length != 0) {
    Object.keys(req.query).forEach((key) => {
      searchParams[key] = req.query[key];
    });
  }
  Order.find(searchParams).populate("buyer").exec(function (err: mongoose.Error, items: IOrder[]) {
    if (err || items.length == 0) {
      res.status(400).send({ message: "Can't find any orders" });
    } else {
      res.send(items);
    }
  });
};



export const orderItem = (req: Request, res: Response) => {
  // req.assert("id", "Invalid ID").isLength({ min: 24, max: 24 });
  // req.assert("time", "Invalid date format").isISO8601();
  // req.assert("servings", "Servings should be 1 or more").isInt({ min: 0 });
  // const errors = req.validationErrors();
  // // respond with errors
  // if (errors) {
  //   res.status(400).send(errors);
  //   return;
  // }
  async.waterfall([
    // Search for item
    function (callback) {
      PublishedItem.findOne({ "_id": req.params.id },
        function (err: mongoose.Error, item: IPublishedItem) {
          if (err || !item) {
            callback("Item doesn't exist");
          }
          else {
            callback(null, item);
          }
        });
    },
    // check if enough available servings, and update it
    function (item: IPublishedItem, callback) {
      let orderServings = Number(req.body.servings);
      if (orderServings > item.servingsRemaining) {
        callback('Not enough available servings');
      }
      else {
        item.servingsRemaining -= orderServings;
        item.save((err: mongoose.Error) => {
          if (err) {
            callback(err.message);
          } else {
            callback(null, item);
          }
        });
      }
    },
    // Save Order
    function (item, callback) {
      const order: IOrder = new Order({
        "pickUptime": req.body.pickUptime,
        "servings": Number(req.body.servings),
        "buyer": getUserIdFromJwt(req),
        "publishedItem": item,
        "buyerComments": req.body.buyerComments,
        "createdOn": new Date,
        "completed": false,
        "price": Number(req.body.price)
      });
      order.save((err: mongoose.Error) => {
        if (err) {
          callback(err.message);
        } else {
          callback(null, order);
        }
      });
    },
  ],
    function (err, result) {
      if (err) {
        res.status(406).send({ "error": err });
      } else {
        res.status(200).send(result);
      }
    });
}