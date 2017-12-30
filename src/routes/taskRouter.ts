import { ITask, Task } from "./../models/task";
import { TaskController } from "./../controllers/taskController";
import { Router, Request, Response, NextFunction } from "express";
import HTTPError from "../models/httperror";
const router = Router();
let controller = new TaskController();

router.get("/findAll", (req: Request, res: Response, next: NextFunction) => {
    controller.findAll(function (err?: HTTPError, tasks?: ITask[]){
        if (!err  && tasks) {
            res.send(tasks);
        } else {
            err ? next(err) : res.send([]);  
        }
    });
});

router.get("/find", (req: Request, res: Response, next: NextFunction) => {
    controller.findTask(req.query.taskId, function (err?: HTTPError, task?: ITask) {
        if (!err  && task) {
            res.send(task);
        } else {
            err ? next(err) : res.send({}); 
        }
    }); 
});

router.post("/create", (req: Request, res: Response, next: NextFunction) => {
    var taskToInsert = new Task(req.body);
    if (!taskToInsert) { 
        next(new HTTPError("Mal formed json!", 400)); 
        return;
    } 

    controller.createTask(taskToInsert, (err?: HTTPError, task?: ITask) => {
        if (err) { 
            next(err); 
        } else if (task) {
            res.send(task);
        } else {
            res.send({});
        }
    });

});

router.get("/findTasksByAssignee", (req: Request, res: Response, next: NextFunction) => {
    controller.findTasksByAssignee(req.query.assigneeId, function (err?: HTTPError, tasks?: ITask[]) {
        if (!err && tasks) {
            res.send(tasks);
        } else {
            err ? next(err) : res.send([]); 
        }
    }); 
});

router.patch("/delete", (req: Request, res: Response, next: NextFunction) => {
    controller.deleteTask(req.query.taskId, function (err?: HTTPError, deletedTask?: ITask) {
        if (!err  && deletedTask) {
            res.send(deletedTask);
        } else {
            err ? next(err) : next(new HTTPError("Could not find the task to delete!" , 410)); 
        }
    }); 
});

router.patch("/complete", (req: Request, res: Response, next: NextFunction) => {
    controller.completeTask(req.query.taskId, function (err?: HTTPError, deletedTask?: ITask) {
        if (!err  && deletedTask) {
            res.send(deletedTask);
        } else {
            err ? next(err) : next(new HTTPError("Could not find the task to mark as completed!" , 410)); 
        }
    }); 
});

export = router;