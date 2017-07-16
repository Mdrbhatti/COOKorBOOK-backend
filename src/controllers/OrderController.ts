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
  Order.find({}, function (err: mongoose.Error, orders: IOrder[]) {
    if (err || orders.length == 0) {
      res.status(400).send({ message: "Can't find any orders" });
    } else {
      res.send(orders);
    }
  });
};

export const orderItem = (req: Request, res: Response) => {
  req.assert("id", "Invalid ID").isLength({ min: 24, max: 24 });
  req.assert("time", "Invalid date format").isISO8601();
  req.assert("servings", "Servings should be 1 or more").isInt({ min: 0 });
  const errors = req.validationErrors();
  // respond with errors
  if (errors) {
    res.status(400).send(errors);
    return;
  }
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
    // Save Order
    function (item, callback) {
      const order: IOrder = new Order({
        "time": req.body.time,
        "servings": req.body.servings,
        "buyer": getUserIdFromJwt(req),
        "publishedItem": item
      });
      order.save((err: mongoose.Error) => {
        if (err) {
          callback(err.message);
        } else {
          callback(null, order);
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