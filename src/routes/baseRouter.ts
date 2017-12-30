import { Router, Request, Response, NextFunction } from "express";
import HTTPError from "../models/httperror";
import * as indexRouter from "./indexRouter";
import * as userRouter from "./userRouter";
import * as taskRouter from "./taskRouter";


const router = Router();

router.use("/", indexRouter);
router.use("/users", userRouter);
router.use("/tasks", taskRouter);

if (process.env.NODE_ENV === "development") {
      router.use(function(err: HTTPError, req: Request, res: Response, next: NextFunction) {
        console.log("development error handler called");        
        res.status(err.statusCode || 500);
        res.json(err);
      });
    
} else {
      // production error handle no stacktraces leaked to user
      router.use(function(err: HTTPError, req: Request, res: Response, next: NextFunction) {
        console.log("production error handler called");
        res.status(err.statusCode || 500);
        res.json({
            message: err.message,
            error: {}
        });
      });
}

export = router;
        



