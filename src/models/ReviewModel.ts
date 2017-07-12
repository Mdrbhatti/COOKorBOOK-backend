import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { IReview } from "../interfaces/IReview";

export const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  description: { type: String },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

export const Review = mongoose.model<IReview>("Review", reviewSchema);
