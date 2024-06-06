import { TagModel } from "./model";
import { Tag } from "./type";


export const createTag = async (tag:Tag) =>{
    return await TagModel.create(tag)
}
export const getTagByTitle = async (search:string) =>{
    return await TagModel.find({
        title:{
            $regex:search,
            $options:'i'
        }
    })
}

