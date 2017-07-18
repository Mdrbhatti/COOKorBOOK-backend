import { PublishedItem } from "../models/PublishedItemModel";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response } from "express";
import { User } from "../models/UserModel";
import { IUser } from "../interfaces/IUser";
import * as mongoose from "mongoose";
const async = require("async");
const fs = require("fs");
const unf = require("unique-file-name");
const path = require('path');

const namer = unf({
  format: "%16b_%6r%8e.png",
  dir: "./images"
});

export const getImage = (req: Request, res: Response) => {
  // get path und send file
  res.sendFile(`${path.resolve()}/images/${req.params.src}`);
};

export const getItem = (req: Request, res: Response) => {
  const searchParams = {};
  if (Object.keys(req.query).length != 0) {
    Object.keys(req.query).forEach((key) => {
      searchParams[key] = req.query[key];
    });
  }
  PublishedItem.find(searchParams).exec(function (err: mongoose.Error, items: IPublishedItem[]) {
    if (err || items.length == 0) {
      res.status(400).send({ message: "Can't find any items" });
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
  console.log(response["type"]);

  return response;
}
export const postItem = (req: Request, res: Response) => {
  const image = decodeBase64Image(req.body.image);
  async.waterfall([
    function (callback) {
      namer("food", function (err, uniquePath) {
        if (err) {
          callback(err.message);
        } else {
          console.log(`Writing file ${uniquePath}`);
          fs.writeFile(uniquePath, image["data"], function (err: any) {
            if (err) {
              callback(err.message);
            } else {
              console.log("Saved img path: " + path.basename(uniquePath));
              // res.send({ msg: "ok" });
              callback(null, path.basename(uniquePath));
            }
          });
        }
      });
    },
    function (imgName, callback) {
      console.log(`http://127.0.0.1:8000/image/${imgName}`);
          const pItem: IPublishedItem = new PublishedItem({
          "name": req.body.name,
          "description": req.body.description,
          "sellerComments": req.body.sellerComments,
          "pricePerPortion": Number(req.body.pricePerPortion),
          "bulkPricing": req.body.bulkPricing,
          "image" : `http://127.0.0.1:8000/image/${imgName}`,
          "type": req.body.type,
          "rating": Number(req.body.rating),
          "addressStreet": req.body.addressStreet,
          "addressPostalCode": req.body.addressPostalCode,
          "addressCity": req.body.addressCity,
          "createdOn": new Date(),
          "servings": Number(req.body.servings),
          "servingsRemaining": Number(req.body.servings),
          "seller": getUserIdFromJwt(req),
          "pickupTime": req.body.pickupTime,
          "ingredients": req.body.ingredients,
          "allergens": req.body.allergens,
          "categories": req.body.categories
      });
      pItem.save((err: mongoose.Error) => {
        if (err) {
          res.status(406).send({ "error": err });
        } else {
          res.status(200).send(pItem);
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