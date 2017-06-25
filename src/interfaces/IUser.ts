import * as mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    username: string;
};