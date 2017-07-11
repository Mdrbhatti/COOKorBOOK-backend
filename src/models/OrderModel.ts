import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { IOrder } from "../interfaces/IOrder";

export const orderSchema = new mongoose.Schema({
  time: {type: Date, required: true},
  servings: {type: Number, required: true},
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  publishedItem: { type: mongoose.Schema.Types.ObjectId, ref: "PublishedItem", required: true}
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
