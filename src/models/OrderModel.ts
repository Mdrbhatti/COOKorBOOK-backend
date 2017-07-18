import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { IOrder } from "../interfaces/IOrder";

export const orderSchema = new mongoose.Schema({
  pickUptime: { type: String, required: true },
  servings: { type: Number, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  publishedItem: { type: mongoose.Schema.Types.ObjectId, ref: "PublishedItem", required: true },
  buyerComments: { type: String, required: true },
  createdOn: { type: Date, required: true },
  completed: { type: Boolean, required: true},
  price: { type: Number, required: true}
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
