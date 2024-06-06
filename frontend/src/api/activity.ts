import { axiosInstance } from "@/config/axios"


export const addActivity = (values:any)=>{
    return axiosInstance.post('/activities',values)
}

export const getActivities = () =>{
    return axiosInstance.get('/activities')
}