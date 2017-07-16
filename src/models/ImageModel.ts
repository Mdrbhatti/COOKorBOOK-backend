import * as mongoose from "mongoose";
import { IImage } from "../interfaces/IImage";

export const imageSchema = new mongoose.Schema({
  path: { type: String, required: true},
  contentType: { type: String, required: true },
});

export const Image = mongoose.model<IImage>("Image", imageSchema);
