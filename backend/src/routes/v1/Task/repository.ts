
import mongoose from "mongoose";
import { TaskModel } from "./model";
import { Task } from "./type";

export const createTask = (body:Task)=>{
    return  TaskModel.create(body)
}
export const getTasks = (id:string)=>{
    return  TaskModel.find({assignee:id}).populate('assigner','-password -__v -createdAt -updatedAt -verificationAttempt')
    .select('-__v -updatedAt -createdAt')
}
export const getTask = (id:string)=>{
    return TaskModel.findById(id).populate('assigner','-password -__v -createdAt -updatedAt -verificationAttempt').populate('comments').select('-__v -updatedAt -createdAt')
}
export const getsingleTask = (id:string)=>{
    return TaskModel.findById(id).select('-__v -updatedAt -createdAt')
}
export const getTasksByAssigner = (id:string)=>{
    return TaskModel.find({assigner:id}).select('-__v -updatedAt -createdAt')
}

export const updateTask = (id:string,body:Task)=>{
    return TaskModel.findByIdAndUpdate(id,
        body
    ,{new:true})
}
export const updateTaskStatus = (id:string,status:string)=>{
    return TaskModel.findByIdAndUpdate(id,{
        $set:{
            status:status
        }
    },{new:true})
}
export const deleteTask =(id:string)=>{
  console.log(id)
    return TaskModel.findByIdAndDelete(id)
}
//comment-task
export const addCommentToTask = async(taskId:string,commentId:string)=>{
    return TaskModel.findOneAndUpdate(
    { _id: taskId },
    {
      $push: {
        comments: new mongoose.Types.ObjectId(commentId),
      },
    },
  );
}
export const removeCommentFromTask = async(taskId:string,commentId:string)=>{
    return TaskModel.findOneAndUpdate(
    { _id: taskId},
    {
      $pull: {
        comments: new mongoose.Types.ObjectId(commentId),
      },
    },
  );
}
//tags-task
export const addTagToTask = async(taskId:string | undefined,tagId:string)=>{
    return TaskModel.findOneAndUpdate(
    { _id: taskId },
    {
      $push: {
        tags: new mongoose.Types.ObjectId(tagId),
      },
    },
  );
}
