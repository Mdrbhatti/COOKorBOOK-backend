import { Order } from "../models/OrderModel";
import { IOrder } from "../interfaces/IOrder";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { PublishedItem } from "../models/PublishedItemModel";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

// export const getOrder = (req: Request, res: Response) => {
//     // Find all
//     Order.find({}, function (err, orders: IOrder[]) {
//         console.log(orders);
//     });
// };

// export const postOrder = (req: Request, res: Response, next: NextFunction) => {
//     // Create order
//     // Get published item
//     // Get user identity

//     // const user: IUser = new User(_.extend(req.body, { lastLogin: new Date(), createdOn: new Date() }));
// PublishedItem.findOne({ username: req.body.username }, function (err: mongoose.Error, item: IPublishedItem) {
//         if (err || !item) {
//             return res.status(400).send({ message: "Item doesn't exist" });
//         }
//         else {

//         }
//     });

// };