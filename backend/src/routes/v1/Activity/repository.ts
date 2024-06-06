import { ObjectId } from "mongoose"
import { ActivityModel } from "./model"
import { Activity } from "./type"


export const create =  (activity:Activity) =>{
    return  ActivityModel.create(activity)
}
export const getAll =  () =>{
    return  ActivityModel.find().populate('taskId')
}
export const getActivity =  (taskId:ObjectId) =>{
    return ActivityModel.find({taskId:taskId})
}


