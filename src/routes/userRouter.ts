import { IUser } from "./../models/user";
import { UserController } from "./../controllers/userController";
import { Router, Request, Response, NextFunction } from "express";
import HTTPError from "../models/httperror"
const router = Router();
let controller = new UserController();

router.get("/findAll", (req: Request, res: Response, next: NextFunction) => {
    controller.findAll((err?: any, users?: IUser[]) => {
        if (!err && users) {
            res.send(users);
        } else {
            err ? next(err) : res.send([]); 
        }
    });
});

router.post("/insert", (req: Request, res: Response, next: NextFunction) => {
    var userToInsert: IUser = req.body;
    if (!userToInsert) { 
        next(new Error("Mal formed json!")); 
        return;
    } 

    controller.insert(userToInsert, (err?: Error, user?: IUser) => {
        if (err) { 
            next(new HTTPError(err.message, 500, err.stack)); 
        } else if (user) {
            res.send(user);
        } else {
            res.send({});
        }
    });

});

router.post("/authenticate", (req: Request, res: Response, next: NextFunction) => {
    var userToLogin: IUser = req.body;
    if (!userToLogin) { 
        next(new Error("Mal formed json!")); 
        return;
    } 

    controller.authenticate(userToLogin, (err?: HTTPError, user?: IUser) => {
        if (err) {
            next(err);
        } else {
            res.send(user ? user : {});
        }
    });
    
});

export = router;
        

