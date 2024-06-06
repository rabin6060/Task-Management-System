import { NextFunction, Request, Response } from 'express';
import { Comment, UpdatedComment } from './type';
import { CommentService } from './service';
import { errorResponse, successResponse } from '../../../utils/HttpResponse';

export const CommentController = {
  async create(req: Request<{taskId:string}, unknown, Comment>, res: Response) {
    const {taskId} = req.params
    const user = res.locals.user
    const comment = {...req.body,taskId:taskId,userId:user._id,user:user.username}
    const newComment = await CommentService.createComment(comment,taskId);
    if (!newComment) {
      return errorResponse({
        response: res,
        message: 'comment creation failed!!!',
      });
    }
    return successResponse({
      response: res,
      message: 'comment successfully added.',
      data: newComment,
    });
  },
  async update(req:Request<{id:string},unknown,UpdatedComment>,res:Response,next:NextFunction){
    try {
      const {id} = req.params
      const body = req.body
      const user = res.locals.user
      const commentInfo = {...body,userId:user._id}
      const result = await CommentService.updateComment(commentInfo,id,user._id)
      return successResponse({
        response: res,
        message: "updated successfully",
        data: result,
        status: 201,
      });

    } catch (error) {
      next(error)
    }
  },
  async delete(req: Request<{taskId:string,id:string}>, res: Response,next:NextFunction) {
    try {
    const {id,taskId} = req.params
    const user = res.locals.user
    
    await CommentService.deleteComment(id,taskId,user._id)
    
     return successResponse({
        response: res,
        message: "comment deleted successfully",
        status: 201,
      });
    } catch (error) {
      next(error)
    }
  },
}

