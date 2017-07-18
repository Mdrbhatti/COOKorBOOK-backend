import * as mongoose from "mongoose";
import { IUser } from "./IUser";
import { IItem } from "./IItem";

export interface IPublishedItem extends mongoose.Document {
  name: string;
  description: string;
  sellerComments: string;
  pricePerPortion: number;
  bulkPricing: boolean;
  image: string; 
  type: string;
  rating: number;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  createdOn: Date;
  servings: number;
  servingsRemaining: number;
  seller: IUser;
  pickupTime: string[];
  ingredients: string[];
  allergens: string[];
  categories: string[];
}
