import { CommentModel } from './model';
import { Comment, UpdatedComment } from './type';

export const create = (body: Comment) => {
  return CommentModel.create(body);
};


export const getComment = (id: string) => {
  return CommentModel.findById(id);
};

export const updateComment = (data: UpdatedComment,commentId:string,userId:string) => {
  return CommentModel.findOneAndUpdate({_id:commentId,userId:userId},data,{
      new:true
    })
};

export const deleteComment = (commentId:string,taskId:string)=>{
 return CommentModel.findOneAndDelete({_id:commentId,taskId:taskId})
}

