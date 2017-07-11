import { Item } from "../models/ItemModel";
import { Allergen } from "../models/AllergenModel";
import { Category } from "../models/CategoryModel";
import { IItem } from "../interfaces/IItem";
import { Request, Response } from "express";
import * as mongoose from "mongoose";

export const postItem = (req: Request, res: Response) => {
  const errors: Array<string> = [];
  const item: IItem = new Item({
    "title": req.body.title,
    "description": req.body.description,
    "allergens": req.body.allergens.map((data: any) => {
      const allergen = new Allergen(data);
      allergen.save((err: mongoose.Error) => {
        if (err) {
          errors.push(err.message)
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
  item.save((err: mongoose.Error) => {
    if (err) {
      errors.push(err.message);
    }
  });
  if (errors) {
    res.status(406).send({ message: errors });
  } else {
    res.status(201);
  }
};
