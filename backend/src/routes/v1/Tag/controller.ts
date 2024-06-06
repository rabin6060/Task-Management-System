import { NextFunction, Request,Response } from "express";
import { Tag } from "./type";
import { errorResponse, successResponse } from "../../../utils/HttpResponse";
import { TagService } from "./service";



export const TagController = {
    async create(req:Request<unknown,unknown,Tag>,res:Response,next:NextFunction){
    try {
      const TagData = req.body;
      const newTag = await TagService.createTag(TagData);
      return successResponse({
        response: res,
        message: 'Tag created successfully!!',
        data: newTag,
      });
    } catch (error) {
      next(error);
    }
    },
    async getTags(req:Request<unknown,unknown,unknown,{search:string}>,res:Response,next:NextFunction){
        try {
            const {search} = req.query
            const Tags = await TagService.getTagBySearchTitle(search)
            if (Tags.length<1) {
                return errorResponse({
                    response:res,
                    message:'sorry no tags matched!!'
                })
            }
            return successResponse({
                response: res,
                message: 'Tags fetched successfully!!',
                data: Tags,
            });
        } catch (error) {
            next(error)
        }
    },
    
}