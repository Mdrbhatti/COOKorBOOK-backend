import * as mongoose from "mongoose";
import { IAllergen } from "./IAllergen";
import { ICategory } from "./ICategory";


export interface IItem extends mongoose.Document {
  title: string;
  description: string;
  allergens: Array<IAllergen>;
  categories: Array<ICategory>;
}
