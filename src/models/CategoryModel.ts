import * as mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory";

export const categorySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String }
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
