import { ITask, Task } from "./../models/task";
import HTTPError from "../models/httperror";

export class TaskController {
    
    constructor() {
        this.createTask = this.createTask.bind(this);
        this.findTask = this.findTask.bind(this);
        this.findTasksByAssignee = this.findTasksByAssignee.bind(this);
        this.findAll = this.findAll.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.completeTask = this.completeTask.bind(this);
    }

    public findAll(callback: (err?: HTTPError, tasks?: ITask[]) => void) {
        Task.find({"deleted": false}, (err, res) => {
            if (err) { 
                callback(new HTTPError(err.message, 500, err.stack));
            } else {
                callback(undefined, res);
            }
        });
    }

    public createTask(task: ITask, callback: (err?: HTTPError, task?: ITask) => void ) {
        task.completed = false;
        task.deleted = false;
        task.save(function (err, savedTask){
            if (err) { 
                callback(new HTTPError(err.message, 500, err.stack));
                return;
            }
            callback(undefined, savedTask);
        });
    }

    public findTask(taskId: String, callback: (err?: HTTPError, task?: ITask) => void) {
        Task.findById(taskId, function (err, taskFound) {
            if (err) {
                callback(new HTTPError(err.message, 500, err.stack)); 
                return;
            }

            if (taskFound) {
                callback(undefined, taskFound);
            } else {
                callback(new HTTPError("Task does not exists!", 410));                
            }
        });
    }

    public findTasksByAssignee(assigneeId: String, callback: (err?: HTTPError, tasks?: ITask[]) => void) {
        Task.find({"assigneeId": assigneeId}, function (err, tasksFound) {
            if (err) { 
                callback(new HTTPError(err.message, 500, err.stack));
                return;
            }

            callback(undefined, tasksFound);
        });
    }

    public deleteTask(taskId: String, callback: (err?: HTTPError, updatedTask?: ITask) => void) {
        Task.findByIdAndUpdate(taskId, { $set: {deleted: true}}, function (err, task) {    
            callback(err ? new HTTPError(err.message, 500, err.stack) : undefined, task ? task : undefined);
        });
    }

    public completeTask(taskId: String, callback: (err?: HTTPError, updatedTask?: ITask) => void) {
        Task.findByIdAndUpdate(taskId, { $set: {completed: true}}, function (err, task) {
            callback(err ? new HTTPError(err.message, 500, err.stack) : undefined, task ? task : undefined);
        });
    }

}