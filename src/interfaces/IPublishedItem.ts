import * as mongoose from "mongoose";
import { IUser } from "./IUser";
import { IItem } from "./IItem";

export interface IPublishedItem extends mongoose.Document {
  time: number;
  servings: number;
  price: number;
  seller: IUser;
  item: IItem;
}
