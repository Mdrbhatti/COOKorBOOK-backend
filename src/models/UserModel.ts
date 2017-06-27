import * as mongoose from 'mongoose';
import * as bcrypt from "bcrypt-nodejs";
import * as passport from "passport";;
import {IUser} from '../interfaces/IUser';

export const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  firstName: {type: String},
  lastName: {type: String},
  userType: {type: String, required: true},
  lastLogin: {type: Date, required: true},
  createdOn: {type: Date, required: true}
});

userSchema.pre('save', function(next) {  
  const user: IUser = this,
        SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error , isMatch: boolean) => {
    cb(err, isMatch);
  });
};

export const User = mongoose.model<IUser>("User", userSchema);
