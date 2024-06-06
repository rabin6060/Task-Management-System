import { ObjectId } from "mongoose";

export interface Activity{
    userId:ObjectId,
    taskId:ObjectId,
    TaskStatus:string,
    Assigner:string
}