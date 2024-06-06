import mongoose from 'mongoose';
import { Task } from './type';


const taskSchema = new mongoose.Schema<Task>(
  {
     title: {
      type: String,
      required: [true, 'Username is Required'],
    },
   
    desc: {
      type: String,
      required: [true, 'Email is Required'],
    },
    tags: [{
      type: String,
      required:true
    }],
    dueDate:{
      type:String,
      required:[true,'specify due date'],
    },
    priority:{
        type:String,
        required:[true,'priority required']
    },
    status:{
        type:String,
        required:true
    },
   
    assigner:{
      type: mongoose.Schema.ObjectId,
      ref:'user',
      required:false
    },
    assignee:[{
      type: mongoose.Schema.ObjectId,
      ref:'user',
      required:false
    }],
    comments:[{
      type: mongoose.Schema.ObjectId,
      ref:'comment',
      required:false
    }],
    activity:[{
      type: mongoose.Schema.ObjectId,
      ref:'activity',
      required:false
    }],
  },
  {
    timestamps: true,
  },
);


export const TaskModel = mongoose.model('task', taskSchema);
