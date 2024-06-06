import mongoose from 'mongoose';
import { Tag } from './type';


const tagSchema = new mongoose.Schema<Tag>(
  {
     title: {
      type: String,
      required: [true, 'Username is Required'],
    },
   
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
  },
  {
    timestamps: true,
  },
);


export const TagModel = mongoose.model('tag', tagSchema);
