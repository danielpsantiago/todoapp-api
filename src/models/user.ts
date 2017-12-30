import { Document, Schema, Model, model } from "mongoose";
import * as bcrypt from "bcrypt";
let SALT_WORK_FACTOR = 10;
// var Profile = require('./Profile');

export interface IUser {
    name:  string;
    childrenQtd: Number;
    maritalStatus: string;
    email: string;
    password?: string;
}

export interface IUserModel extends IUser, Document {
    comparePasswords(cadidatePassword: string, callback: (err?: Error, isMatch?: boolean) => void): void;
}

export const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    childrenQtd : {type: Number, required: true},
    maritalStatus : {type: String,  required: true},
    email: {type: String,  required: true, unique: true},
    password: {type: String, required: true} 
});

UserSchema.pre("save", function(next: any){
    const user = this;
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err: Error, salt: string){
        if (err) { next(err); }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) { next(err); return; }

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePasswords = function(cadidatePassword: string, callback: (err?: Error, isMatch?: boolean) => void){
    bcrypt.compare(cadidatePassword, this.password, (err: Error, same: boolean) => {
        if (!err) { 
            callback(undefined, same);
        } else {
            callback(err);
        }
    });
};  

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);