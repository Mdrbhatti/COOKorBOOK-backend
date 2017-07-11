import * as mongoose from "mongoose";
import { IUser } from "./IUser";

export interface IReview extends mongoose.Document {
  rating: number;
  description: string;
  buyer: IUser;
  seller: IUser;
}
