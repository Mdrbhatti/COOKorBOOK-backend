import * as mongoose from "mongoose";
import { IUser } from "./IUser";
import { IPublishedItem } from "./IPublishedItem";


export interface IOrder extends mongoose.Document {
  completed: boolean;
  pickUptime: string;
  servings: number;
  buyer: IUser;
  publishedItem: IPublishedItem;
  buyerComments: String;
  createdOn: Date;
  price: number;
}
