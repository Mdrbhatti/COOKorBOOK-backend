import { PublishedItem } from "../models/PublishedItemModel";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response } from "express";
import { User } from "../models/UserModel";
import { IUser } from "../interfaces/IUser";

import * as mongoose from "mongoose";

const async = require("async");

export const postItem = (req: Request, res: Response) => {
  const pItem: IPublishedItem = new PublishedItem({
    "name": req.body.name,
    "description": req.body.description,
    "sellerComments": req.body.sellerComments,
    "pricePerPortion": req.body.pricePerPortion,
    "bulkPricing": req.body.bulkPricing,
    "image": req.body.image,
    "type": req.body.type,
    "rating": Number(req.body.rating),
    "addressStreet": req.body.addressStreet,
    "addressPostalCode": req.body.addressPostalCode,
    "addressCity": req.body.addressCity,
    "createdOn": new Date(),
    "servings": Number(req.body.servings),
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