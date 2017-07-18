import { PublishedItem } from "../models/PublishedItemModel";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response } from "express";
import { User } from "../models/UserModel";
import { IUser } from "../interfaces/IUser";
import * as mongoose from "mongoose";
const async = require("async");

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
export const postItem = (req: Request, res: Response) => {
  const pItem: IPublishedItem = new PublishedItem({
    "name": req.body.name,
    "description": req.body.description,
    "sellerComments": req.body.sellerComments,
    "pricePerPortion": Number(req.body.pricePerPortion),
    "bulkPricing": req.body.bulkPricing,
    "image": req.body.image,
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