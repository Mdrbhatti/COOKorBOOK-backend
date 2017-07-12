import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { IItem } from "../interfaces/IItem";
import { IPublishedItem } from "../interfaces/IPublishedItem";

export const publishedItemSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  servings: { type: Number, required: true },
  price: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, "ref": "User", required: true },
  item: { type: mongoose.Schema.Types.ObjectId, "ref": "Item", required: true }
});

export const PublishedItem = mongoose.model<IPublishedItem>("PublishedItem", publishedItemSchema);
