import mongoose from "mongoose";
import { Activity } from "./type";

const activitySchema = new mongoose.Schema<Activity>({
    
    userId: {
      type: mongoose.Schema.ObjectId,
      ref:'user',
      required: false
    },
    taskId: {
      type: mongoose.Schema.ObjectId,
      ref:'task',
      required:false
    },
    TaskStatus:{
      type:String,
      required:true
    },
    Assigner:{
      type:String,
      required:true
    }
},{timestamps:true})

export const ActivityModel =  mongoose.model('activity',activitySchema)