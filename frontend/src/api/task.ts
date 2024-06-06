import { axiosInstance } from "@/config/axios"


export const createTask = (values:any)=>{
    return axiosInstance.post('/tasks',values)
}
export const singleTask = (id:string)=>{
    if (id===undefined) {
        return
    }
    return axiosInstance.get(`/tasks/${id}/task`)
}
export const getAllTask = (id:string | undefined)=>{
    if (id===undefined) {
        return
    }
    return axiosInstance.get(`/tasks/${id}`)
}
export const getAllTaskByAssigner = (id:string | undefined)=>{
    if (id===undefined) {
        return
    }
    return axiosInstance.get(`/tasks/${id}/taskbyassigner`)
}

export const updateStatus = (id:string,status:string|undefined) => {
    if (id===undefined) {
        return
    }
   return axiosInstance.patch(`/tasks/${id}/status`,{status})
}

export const deleteTasks = (id:string | undefined) => {
     if (id===undefined) {
        return
    }
    return axiosInstance.delete(`/tasks/${id}`)
}
export const updateTask = (id:string | undefined,values:any) => {
     if (id===undefined) {
        return
    }
    console.log(id,values)
    return axiosInstance.patch(`/tasks/${id}`,values)
}

