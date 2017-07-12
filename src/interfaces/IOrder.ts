import * as mongoose from "mongoose";
import { IUser } from "./IUser";
import { IPublishedItem } from "./IPublishedItem";


export interface IOrder extends mongoose.Document {
  time: number;
  servings: number;
  buyer: IUser;
  publishedItem: IPublishedItem;
}
