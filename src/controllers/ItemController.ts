import { Item } from "../models/ItemModel";
import { IItem } from "../interfaces/IItem";
import { Allergen } from "../models/AllergenModel";
import { IAllergen } from "../interfaces/IAllergen";
import { Category } from "../models/CategoryModel";
import { ICategory } from "../interfaces/ICategory";
import { Image } from "../models/ImageModel";
import { IImage } from "../interfaces/IImage";
import { PublishedItem } from "../models/PublishedItemModel";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response } from "express";
import * as mongoose from "mongoose";
import {User} from "../models/UserModel";
const fs = require("fs");
const async = require("async");
const unf = require("unique-file-name");

const namer = unf({
  format: "%4Y-%M-%D/%16b_%6r%8e"
});

export const getItems = (req: Request, res: Response) => {
  const searchParams = {};
  if (Object.keys(req.query).length == 0) {
    console.log("No key queries - simple retrieval");
  } else {
    Object.keys(req.query).forEach((key) => {
      searchParams[key] = new RegExp(req.query[key], "i");
    });
  }
  Item.find(searchParams)
    .populate("allergens")
    .populate("categories")
    .populate("image")
    .exec(function (err: mongoose.Error, items: IItem[]) {
      if (err || !items) {
        res.status(400).send({ message: "Can't find any items" });
      } else {
        res.send(items);
      }
    });
};

export const getPublishedItems = (req: Request, res: Response) => {
  PublishedItem.find({}, function (err: mongoose.Error, items: IPublishedItem[]) {
    if (err || items.length == 0) {
      res.status(400).send({ message: "Can't find any published items" });
    } else {
      res.send(items);
    }
  });
};

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response["type"] = matches[1];
  response["data"] = new Buffer(matches[2], "base64");

  return response;
}

// This can be broken down into separate request in the future
export const postItem = (req: any, res: Response) => {
  req.assert("title", "Title should be of length 10-255 chars").isLength({ min: 5, max: 255 });
  req.assert("description", "Description length 25-25556 chars").isLength({ min: 5, max: 25556 });
  const errors = req.validationErrors();
  // respond with errors
  if (errors) {
    res.status(400).send(errors);
    return;
  }

  var allergensList = req.body.allergens;
  var categoriesList = req.body.categories;
  var categories = [];
  var allergens = [];
  let img: IImage = new Image();
  async.waterfall([
    // Insert allergens in collection
    function (callback) {
      async.each(allergensList, function (data, cb_each) {
        Allergen.findOne({ title: data.title }, (err: mongoose.Error, allergen: IAllergen) => {
          if (err || !allergen) {
            allergen = new Allergen(data);
            allergen.save((err: mongoose.Error) => {
              if (err) {
                cb_each(err.message);
              } else {
                allergens.push(allergen);
                cb_each(null);
              }
            });
          } else {
            allergens.push(allergen);
            cb_each(null);
          }
        });
      }, function (err) {
        if (err) {
          callback(err.message);
        } else {
          callback(null);
        }
      });
    },
    // Insert categories in collection
    function (callback) {
      async.each(categoriesList, function (data, cb_each) {
        Category.findOne({ title: data.title }, (err: mongoose.Error, category: ICategory) => {
          if (err || !category) {
            //category doesn"t exist - create it
            category = new Category(data);
            category.save((err: mongoose.Error) => {
              if (err) {
                cb_each(err.message);
              } else {
                categories.push(category);
                cb_each(null);
              }
            });
          } else {
            categories.push(category);
            cb_each(null);
          }
        });
      }, function (err) {
        if (err) {
          callback(err.message);
        } else {
          callback(null);
        }
      });
    },
    // save image
    function (callback) {
      if (req.body.image !== "") {
        const image = decodeBase64Image(req.body.image);
        namer("food", function (err, uniquePath) {
          if (err) {
            callback(err.message);
          } else {
            console.log(`Writing file ${uniquePath}`);
            fs.writeFile(uniquePath, image["data"], function (err: any) {
              if (err) {
                console.log(err.message);
                callback(err.message);
              } else {
                img.path = uniquePath;
                img.contentType = image["type"];
                img.save((err: mongoose.Error) => {
                  if (err) {
                    callback(err.message);
                  } else {
                    callback(null);
                  }
                })
              }
            })
          }
        })
      } else {
        callback(null);
      }
    },
    // Insert Item in collection
    function (callback) {
      const item: IItem = new Item({
        "title": req.body.title,
        "description": req.body.description,
        "allergens": allergens,
        "categories": categories,
        "image": img
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
  ],
    function (err, result) {
      if (err) {
        res.status(406).send({ "error": err });
      } else {
        res.status(200).send(result);
      }
    });
}

export const publishItem = (req: Request, res: Response) => {
  req.assert("id", "Invalid ID").isLength({ min: 24, max: 24 });
  req.assert("time", "Invalid date format").isISO8601();
  req.assert("servings", "Servings should be 1 or more").isInt({ min: 1 });
  const errors = req.validationErrors();
  // respond with errors
  if (errors) {
    res.status(400).send(errors);
    return;
  }
  async.waterfall([
    // Search for item
    function (callback) {
      Item.findOne({ "_id": req.params.id }, function (err: mongoose.Error, item: IItem) {
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
          callback(null, publishedItem);
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

};

export const getPublishedItemsForSeller = (req: Request, res: Response) => {
  const errors: Array<string> =[];

  // const user = User.findOne({"username": req.body.seller});
  console.log(getUserIdFromJwt(req));



  PublishedItem.find({"seller": getUserIdFromJwt(req)}).populate("item").exec( function (err: mongoose.Error, items: IPublishedItem[]) {
    if (err || items.length == 0) {
      res.status(400).send({ message: "Can't find any published items" });
    } else {
      res.send(items);
    }
  });
}

export const updatePublishedItemsForSeller = (req: Request, res: Response) => {
  const errors: Array<string> =[];
  PublishedItem.findOneAndUpdate({"seller": getUserIdFromJwt(req), "item": req.body.itemId}, {"servings": req.body.servings, "price": req.body.price}, function (err: mongoose.Error) {
    if (err) {
      res.status(400).send({ message: "Update failed." });
    }
    else{
      res.status(200).send({message:"success"});
    }
  });
}

