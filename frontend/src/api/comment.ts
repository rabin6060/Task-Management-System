import { axiosInstance } from "@/config/axios"


export const addComment = (taskId:string | undefined,content:string)=>{
    return axiosInstance.post(`/tasks/${taskId}/comments`,{content})
}

export const deleteComment = (taskId:string,id:string) => {
    return axiosInstance.delete(`/tasks/${taskId}/comments/${id}`)
}
