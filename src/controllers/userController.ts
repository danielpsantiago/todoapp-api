import { IUser, User } from "./../models/user";
import HTTPError from "../models/httperror";

export class UserController {

    constructor() {
        this.findAll = this.findAll.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }
    
    public findAll(callback: (err?: Error, users?: IUser[]) => void) {
        User.find((err: any, res: IUser[]) => {
            if (err) { 
                callback(err);
            } else {
                callback(undefined, res);
            }
        });
    }

    public authenticate(user: IUser, callback: (err?: HTTPError, authenticatedUser?: IUser) => void) {
        if (!user.password) {
            callback(new HTTPError("You should provide your password!"))
            return;
        }

        User.find({"email": user.email}, function(err, users){ 
            if (err) { callback(new HTTPError(err.message, 401), undefined); return; }
            
            var foundUser = users[0];
            if (foundUser) {
                foundUser.comparePasswords(user.password!, (err?: Error, isMatch?: boolean) => {
                    if (err) {
                        callback(new HTTPError(err.message, 401, err.stack));
                    } else if (isMatch) {
                        foundUser.password = undefined;
                        callback(undefined, foundUser);
                    } else {
                        callback(new HTTPError("Wrong password!", 401));
                    }
                });
            } else {
                callback(new HTTPError("Wrong username!", 401)); 
            }
            
        });
    }
    
    public insert(userToInsert: IUser, callback: (err?: Error, user?: IUser) => void) {
        User.find({"email": userToInsert.email},  function(err, userFound){
            if (err) { callback(err); }
    
            if (!userFound || userFound == null || userFound.length === 0) {
                let user = new User(userToInsert);            
                user.save(function(err){
                    if (err) { 
                        callback(err); 
                        return;
                     }
    
                    callback(undefined, userToInsert);
                });
            }else {
                var error = new Error("Attempt to insert an existent user!");
                callback(error);
            }
        });
    }

}