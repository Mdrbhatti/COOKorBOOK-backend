import * as mongoose from "mongoose";
import { IUser } from "./IUser";

export interface IReview extends mongoose.Document {
  title: string;
  rating: number;
  description: string;
  buyer: IUser;
  seller: IUser;
}
