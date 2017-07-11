import * as mongoose from "mongoose";

export interface ICategory extends mongoose.Document {
  title: string;
  description: string;
}
