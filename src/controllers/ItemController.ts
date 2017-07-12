import { Item } from "../models/ItemModel";
import { Allergen } from "../models/AllergenModel";
import { Category } from "../models/CategoryModel";
import { PublishedItem } from "../models/PublishedItemModel";
import { IItem } from "../interfaces/IItem";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { Request, Response } from "express";
import * as mongoose from "mongoose";

export const getItems = (req: Request, res: Response) => {
  const title = req.params.title;
  Item.find({ title: new RegExp(title, "i") })
    .limit(10)
    .exec()
    .then((items: Array<IItem>) => {
      res.jsonp(items);
    });
};

export const postItem = (req: Request, res: Response) => {
  const errors: Array<string> = [];
  const item: IItem = new Item({
    "title": req.body.title,
    "description": req.body.description,
    "allergens": req.body.allergens.map((data: any) => {
      const allergen = new Allergen(data);

      allergen.save((err: mongoose.Error) => {
        if (err) {
          errors.push(err.message);
        }
      });

      return allergen;
    }),
    "categories": req.body.categories.map((data: any) => {
      const category = new Category(data);

      category.save((err: mongoose.Error) => {
        if (err) {
          errors.push(err.message);
        }
      });

      return category;
    })
  });
  if (errors) {
    res.status(406).send({ message: errors });
  } else {
    res.status(201);
  }
};

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

      if (errors) {
        res.status(406).send({ message: errors });
      } else {
        res.status(201);
      }
    });
};
