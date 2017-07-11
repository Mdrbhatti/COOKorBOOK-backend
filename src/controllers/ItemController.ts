import { Item } from "../models/ItemModel";
import { Allergen } from "../models/AllergenModel";
import { Category } from "../models/CategoryModel";
import { IItem } from "../interfaces/IItem";
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
