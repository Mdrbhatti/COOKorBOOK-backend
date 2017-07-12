import * as mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory";
import { IItem } from "../interfaces/IItem";

export const itemSchema = new mongoose.Schema({
  title: { type: String, required: true},
  description: { type: String },
  allergens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Allergen" }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
});

itemSchema.path("categories").validate((value: Array<ICategory>) => {
  return value.length;
}, "'categories' cannot be empty array");

export const Item = mongoose.model<IItem>("Item", itemSchema);
