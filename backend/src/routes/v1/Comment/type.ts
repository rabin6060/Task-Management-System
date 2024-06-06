import { ObjectId } from "mongoose";


export interface Comment{
    userId?:ObjectId,
    taskId?:string,
    content:string,
    user:string
}

export interface UpdatedComment{
    content:string
}