import { Item } from "../models/ItemModel";
import { IItem } from "../interfaces/IItem";
import { Allergen } from "../models/AllergenModel";
import { Category } from "../models/CategoryModel";
import { PublishedItem } from "../models/PublishedItemModel";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response} from "express";
import * as mongoose from "mongoose";
const async = require('async');

export const getItems = (req: Request, res: Response) => {
  const title = req.params.title;
  Item.find({}, function (err: mongoose.Error, items: IItem[]) {
    if (err || !items) {
      res.status(400).send({ message: "Can't find any items" });
    } else {
      res.send(items);
    }
  });
};

// This can be broken down into separate request in the future
export const postItem = (req: Request, res: Response) => {
  var allergensList = req.body.allergens;
  var categoriesList = req.body.categories;
  var categories = [];
  var allergens = [];

  async.waterfall([
    // Insert allergens in collection
    function (callback) {
      async.each(allergensList, function (data, cb_each) {
        const allergen = new Allergen(data);
        allergen.save((err: mongoose.Error) => {
          if (err) {
            callback(err.message);
          }
          else {
            allergens.push(allergen);
            callback(null);
          }
        });
      });
    },
    // Insert categories in collection
    function (callback) {
      async.each(categoriesList, function (data, cb_each) {
        const category = new Category(data);
        category.save((err: mongoose.Error) => {
          if (err) {
            callback(err.message);
          }
          else {
            categories.push(category);
            callback(null);
          }
        });
      });
    },
    // Insert Item in collection
    function (callback) {
      const item: IItem = new Item({
        "title": req.body.title,
        "description": req.body.description,
        "allergens": allergens,
        "categories": categories
      });
      item.save((err: mongoose.Error) => {
        if (err) {
          callback(err.message);
        }
        else {
          callback(null, item);
        }
      });
    }
  ], function (err, result) {
    if (err) {
      res.status(406).send({ "error": err });
    } else {
      res.status(200).send(result);
    }
  });
}

export const publishItem = (req: Request, res: Response) => {
  async.waterfall([
    // Search for item
    function (callback) {
      Item.findOne({"_id": req.params.id}, function (err: mongoose.Error, item: IItem) {
        if (err || !item) {
          callback("Item doesn't exist");
        }
        else {
          callback(null, item);
        }
      });
    },
    // Save PublishedItem
    function (item, callback) {
      const publishedItem: IPublishedItem = new PublishedItem({
        "time": req.body.time,
        "servings": req.body.servings,
        "price": req.body.price,
        "seller": getUserIdFromJwt(req),
        "item": item
      });
      publishedItem.save((err: mongoose.Error) => {
        if (err) {
          callback(err.message);
        } else {
          callback(publishedItem);
        }
      });
    }
  ], function (err, result) {
    if (err) {
      res.status(406).send({ "error": err });
    } else {
      res.status(200).send(result);
    }
  });
}