import * as mongoose from "mongoose";


export interface IImage extends mongoose.Document {
  path: String;

  contentType: String;
}
