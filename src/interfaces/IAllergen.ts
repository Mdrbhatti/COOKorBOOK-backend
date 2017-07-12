import * as mongoose from "mongoose";

export interface IAllergen extends mongoose.Document {
  title: string;
  description: string;
}
