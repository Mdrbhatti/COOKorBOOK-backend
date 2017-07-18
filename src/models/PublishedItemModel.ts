import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { IItem } from "../interfaces/IItem";
import { IPublishedItem } from "../interfaces/IPublishedItem";

export const publishedItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sellerComments: { type: String, required: true },
  pricePerPortion: { type: String, required: true },
  bulkPricing: { type: Boolean, required: true },
  image: { type: String, required: true }, 
  type: { type: String, required: true }, //is vegan or not
  rating: { type: Number, required: true },
  addressStreet: { type: String, required: true },
  addressPostalCode: { type: String, required: true },
  addressCity: { type: String, required: true },
  createdOn: { type: Date, required: true },
  servings: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, "ref": "User", required: true },
  pickupTime: { type: [String], required: true },
  ingredients:{ type: [String], required: true },
  allergens: { type: [String], required: true },
  categories: { type: [String], required: true }
});

export const PublishedItem = mongoose.model<IPublishedItem>("PublishedItem", publishedItemSchema);
