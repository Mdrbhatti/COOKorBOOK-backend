import { Order } from "../models/OrderModel";
import { IOrder } from "../interfaces/IOrder";
import { Item } from "../models/ItemModel";
import { IItem } from "../interfaces/IItem";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { PublishedItem } from "../models/PublishedItemModel";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
const async = require('async');

export const orderItem = (req: Request, res: Response) => {
    //    time: {type: Date, required: true},
    //   servings: {type: Number, required: true},
    //   buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    //   publishedItem: { type: mongoose.Schema.Types.ObjectId, ref: "PublishedItem", required: true}
    Item.findOne({ "_id": req.params.id })
        .then((item: IItem) => {
            var servings: number = req.body.servings;
            var buyer = getUserIdFromJwt(req);
        });

};