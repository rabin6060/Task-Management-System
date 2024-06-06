import mongoose, { Document } from 'mongoose';

export interface Post {
  title: string;
  content: string;
}

export interface PostDocument extends Document, Post {
  comments?: [];
  author?: string;
}

const postSchema = new mongoose.Schema<PostDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is Required'],
      unique: false,
    },
    content: {
      type: String,
      required: [true, 'Content is Required'],
      unique: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Author is Required'],
      unique: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const PostModel = mongoose.model<PostDocument>('post', postSchema);
