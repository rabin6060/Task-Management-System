import CustomError from '../../../utils/Error';
import { Post } from './model';
import { createPost, deletePost, editPost, getAllPosts, getPost } from './repository';
import { messages } from '../../../utils/Messages';
import { PostQuery } from './types';

export const PostsService = {
  createPost(data: Post, userId: string) {
    return createPost(data, userId);
  },

  getPosts(query: PostQuery) {
    return getAllPosts(query);
  },

  async getPost(id: string) {
    const post = await getPost(id);
    if (!post) throw new CustomError(messages.post.not_found, 404);
    return post;
  },

  async updatePost(id: string, data: Partial<Post>, userId: string) {
    await this.getPost(id);

    const res = await editPost(id, userId, data);
    if (!res) throw new CustomError(messages.post.edit_forbidden, 403);

    return res;
  },

  async deletePost(id: string, userId: string) {
    const post = await deletePost(id, userId);
    if (!post) throw new CustomError(messages.post.not_found, 404);
    return true;
  },
};
