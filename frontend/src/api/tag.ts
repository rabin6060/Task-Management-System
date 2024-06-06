import { axiosInstance } from "@/config/axios"


export const addTag = (values:any)=>{
    return axiosInstance.post('/tags',values)
}
