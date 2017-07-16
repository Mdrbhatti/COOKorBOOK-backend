import * as mongoose from "mongoose";
import { IAllergen } from "./IAllergen";
import { ICategory } from "./ICategory";
import { IImage } from "./IImage";


export interface IItem extends mongoose.Document {
  title: string;
  description: string;
  image: IImage;
  allergens: Array<IAllergen>;
  categories: Array<ICategory>;
}
