import { PublishedItem } from "../models/PublishedItemModel";
import { IPublishedItem } from "../interfaces/IPublishedItem";
import { getUserIdFromJwt } from "./UsersController";
import { Request, Response } from "express";
import { User } from "../models/UserModel";
import { IUser } from "../interfaces/IUser";

import * as mongoose from "mongoose";

const async = require("async");

