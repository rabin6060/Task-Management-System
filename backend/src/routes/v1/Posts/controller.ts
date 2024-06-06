import { Response, Request, NextFunction } from 'express';
import { errorHandler } from '../../../utils/Error';
import { Post } from './model';
import { PostsService } from './service';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { PostQuery } from './types';

const PostsController = {
  async createPost(req: Request<unknown, unknown, Post>, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const userId = res.locals.user._id as string;
      const result = await PostsService.createPost(body, userId);
      return successResponse({
        response: res,
        message: messages.post.creation_success,
        data: result,
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPosts(req: Request<unknown, unknown, unknown, PostQuery>, res: Response) {
    try {
      const query = req.query;
      const result = await PostsService.getPosts(query);
      return successResponse({
        response: res,
        message: messages.post.all_get_success,
        data: result,
        status: 201,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async getPost(req: Request<{ id: string }, unknown, unknown>, res: Response) {
    try {
      const { id } = req.params;
      const result = await PostsService.getPost(id);
      return successResponse({
        response: res,
        message: messages.post.one_get_success,
        data: result,
        status: 200,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async updatePost(req: Request<{ id: string }, unknown, Partial<Post>>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = res.locals.user._id as string;
      const body = req.body;
      const result = await PostsService.updatePost(id, body, userId);
      return successResponse({
        response: res,
        message: messages.post.edit_success,
        data: result,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  },

  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = res.locals.user._id as string;
      await PostsService.deletePost(id, userId);
      return successResponse({
        response: res,
        message: messages.post.delete_success,
        status: 200,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
};

export default PostsController;
