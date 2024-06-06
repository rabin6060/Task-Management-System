import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import { Post, PostDocument, PostModel } from './model';
import { PostQuery, PostsReturn } from './types';
import { isInteger } from '../../../utils';

export const createPost = (data: Post, userId: string): Promise<PostDocument> => {
  const post = new PostModel({ ...data, author: userId });
  return post.save();
};

export const addCommentToPost = (postID: string, commentId: string) => {
  return PostModel.findOneAndUpdate(
    { _id: postID },
    {
      $push: {
        comments: new mongoose.Types.ObjectId(commentId),
      },
    },
  );
};

export const getAllPosts = async (query: PostQuery): Promise<PostsReturn> => {
  const { page = '1', limit, sort, title } = query;

  const conditions: FilterQuery<PostDocument> = {};
  const sortQuery: { createdAt: SortOrder } = { createdAt: 'asc' };

  if (title) {
    conditions.title = {
      $regex: title,
      $options: 'i',
    };
  }

  if (sort && sort === 'desc') {
    sortQuery.createdAt = 'desc';
  }

  const pageSize = limit && isInteger(limit) ? parseInt(limit) : 10;
  const skip = isInteger(page) ? parseInt(page) * pageSize - pageSize : 1 * pageSize - pageSize;

  const postDocuments = PostModel.find(conditions)
    .sort(sortQuery)
    .skip(skip)
    .limit(pageSize)
    .populate({ path: 'author', select: '_id email' })
    .populate({
      path: 'comments',
      select: '_id content author createdAt updatedAt',
      populate: { path: 'author', select: '_id email username ' },
    })
    .lean();

  const totalPostDocs = PostModel.countDocuments(conditions);

  const [posts, totalPosts] = await Promise.all([postDocuments, totalPostDocs]);

  return {
    posts,
    totalPosts,
    page: parseInt(page),
    totalPage: Math.ceil(totalPosts / pageSize),
  };
};

export const getPost = (id: string): Promise<PostDocument | null> => {
  return PostModel.findById(id)
    .populate({ path: 'author', select: '_id email' })
    .populate({
      path: 'comments',
      select: '_id content author createdAt updatedAt',
      populate: { path: 'author', select: '_id email username ' },
    });
};

export const editPost = (id: string, author: string, data: Partial<Post>): Promise<PostDocument | null> => {
  return PostModel.findOneAndUpdate({ _id: id, author: author }, data, { new: true });
};

export const deletePost = (id: string, author: string) => {
  return PostModel.deleteOne({ _id: id, author: author });
};
