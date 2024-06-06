import mongoose from 'mongoose';
import { Comment } from './type';

const commentSchema = new mongoose.Schema<Comment>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: false,
    },
    taskId: {
      type: mongoose.Schema.ObjectId,
      ref: 'task',
      required: false,
    },
    content: {
      type: String,
      required: [true, 'comment required'],
    },
    user: {
      type: String,
      required: [true, 'comment required'],
    },

  },
  { timestamps: true },
);

export const CommentModel = mongoose.model('comment', commentSchema);
