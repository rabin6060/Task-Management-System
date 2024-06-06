import {ObjectId} from "mongoose";

export interface Task {
  title:string,
  desc:string,
  tags:string[],
  dueDate:string,
  priority:string,
  status:string,
  assigner:ObjectId,
  assignee:ObjectId[],
  comments?:ObjectId[],
  activity?:ObjectId[],
}

export interface TaskStatus{
  status:string
}
