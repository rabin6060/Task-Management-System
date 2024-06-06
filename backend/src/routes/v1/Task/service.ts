
import {  createTask, deleteTask, getsingleTask, getTask, getTasks, getTasksByAssigner, updateTask, updateTaskStatus } from "./repository";
import { Task } from "./type";


export const TaskService = {
    async createTask(body:Task){
        return createTask(body)
    },
    async getAllTasks(id:string){
        return getTasks(id)

    },
    async getSingleUserTask(id:string){
        return getTask(id)
    },
    async getSingleTask(id:string){
        return getsingleTask(id)
    },
    async getTasksByAssigner(id:string){
        return getTasksByAssigner(id)
    },
    async updateTask(id:string,body:Task){
        return updateTask(id,body)
    },
    async updateTaskStatus(id:string,status:string){
        return updateTaskStatus(id,status)
    },

    async deleteTask(id:string){
        return deleteTask(id)
    },
    
}