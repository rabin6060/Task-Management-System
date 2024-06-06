import { addTagToTask } from "../Task/repository"
import { createTag, getTagByTitle } from "./repository"
import { Tag } from "./type"


export const TagService = {
    async createTag(tag:Tag){
        const newTag=await createTag(tag)
        await addTagToTask(newTag.taskId?.toString(),newTag._id.toString())
        return newTag
    },
    async getTagBySearchTitle(search:string){
        return getTagByTitle(search)
    }
}