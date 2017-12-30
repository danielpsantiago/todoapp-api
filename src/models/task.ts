import { Document, Schema, Model, model } from "mongoose";

export interface ITask extends Document {
    name: string;
    createdAt: Date;
    dueTo: Date;
    completed: boolean;
    assigneeId: String;
    createdById: String;
    deleted: boolean;
}

export var TaskSchema: Schema = new Schema({
    name: String,
    createdAt: Date,
    dueTo: Date,   
    completed: Boolean,
    assigneeId: String,
    createdById: String,
    deleted: Boolean
});

export const Task: Model<ITask> = model<ITask>("Task", TaskSchema);