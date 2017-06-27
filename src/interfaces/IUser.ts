import * as mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
    // Two types of users, more can follow if needed (producer/cook vs consumer/buyer etc)
    userType: string;
    location?: string;
    avatar?: { data: Buffer, contentType: String };
    lastLogin: Date;
    createdOn: Date;
    comparePassword(candidatePassword: string, cb: (err: any, isMatch: any) => {}): void;
};