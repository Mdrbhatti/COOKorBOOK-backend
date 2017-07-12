import { Item } from "../models/ItemModel";
import { PublishedItem } from "../models/PublishedItemModel";
import { IItem } from "../interfaces/IItem";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { Request, Response } from "express";
import * as mongoose from "mongoose";

export const publishItem = (req: Request, res: Response) => {
  const errors: Array<string> = [];

  Item.findOne({ "_id": req.params.id })
    .then((item: IItem) => {
      const publishedItem: IPublishedItem = new PublishedItem({
        "time": req.body.time,
        "servings": req.body.servings,
        "price": req.body.price,
        "seller": req.body,
        "item": item
      });
      publishedItem.save((err: mongoose.Error) => {
        if (err) {
          errors.push(err.message);
        }
      });
    }, (err: mongoose.Error) => {
      errors.push(err.message);
    });

  if (errors) {
    res.status(406).send({ message: errors });
  } else {
    res.status(201);
  }
};
