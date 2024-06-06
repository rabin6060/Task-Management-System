import { create, deleteComment, getComment, updateComment } from './repository';
import { Comment, UpdatedComment } from './type';
import { addCommentToTask, getTask, removeCommentFromTask } from '../Task/repository';
import CustomError from '../../../utils/Error';

export const CommentService = {
  async createComment(body: Comment,taskId:string) {
    const comment =await create(body);
    addCommentToTask(taskId,comment._id.toString())
    return comment
  },

  async getComment(commentId:string){
    const comment = await getComment(commentId);
    return comment

  },
   async updateComment(data:UpdatedComment,commentId:string,userId:string) {
    const comment = await getComment(commentId);
    if (!comment) {
      throw new CustomError("no comment found",400)
    }
    const update = await updateComment(data,commentId,userId)
     if (!update) {
      throw new CustomError("unauthorized!!!",400)
    }
    return update
  },

  
  async deleteComment(id:string,taskId:string,userId:string) {
    const comment = await getComment(id);
    
     if (!comment) {
      throw new CustomError("already deleted!!",400)
    }
    const task = await getTask(taskId)
    if (!task) {
      throw new CustomError("no task",400)
    }
    
   
    const deleteCommens = await deleteComment(id,taskId)
    console.log(deleteCommens)
    if (!deleteCommens) {
      throw new CustomError("not deleted!!!",400)
    }
    
    await removeCommentFromTask(taskId,id)
    return deleteCommens
  },
};
