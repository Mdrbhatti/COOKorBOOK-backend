import * as mongoose from "mongoose";
import { IAllergen } from "../interfaces/IAllergen";

export const allergenSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String }
});

export const Allergen = mongoose.model<IAllergen>("Allergen", allergenSchema);
