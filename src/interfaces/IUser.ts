import * as mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
    lastLogin: Date;
    createdOn: Date;
    comparePassword(candidatePassword: string, cb: (err: any, isMatch: any) => {}): void;
};