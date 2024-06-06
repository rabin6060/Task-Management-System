import { NextFunction, Request,Response } from "express";
import { Task} from "./type";
import { TaskService } from "./service";
import { errorResponse, successResponse } from "../../../utils/HttpResponse";
import CustomError from "../../../utils/Error";
import { ActivityService } from "../Activity/service";
import {Activity} from '../Activity/type'



export const TaskController = {
    async create(req:Request<unknown,unknown,Task>,res:Response,next:NextFunction){
         try {
      const taskData = req.body;
      const newTask = await TaskService.createTask(taskData);
      return successResponse({
        response: res,
        message: 'task created successfully!!',
        data: newTask,
      });
    } catch (error) {
      next(error);
    }
    },
    async getTasks(req:Request<{id:string},unknown,unknown>,res:Response,next:NextFunction){
        try {
            const {id} = req.params
            const tasks = await TaskService.getAllTasks(id)
            return successResponse({
                response: res,
                message: 'tasks fetched successfully!!',
                data: tasks,
            });
        } catch (error) {
            next(error)
        }
    },
    async getTask(req:Request<{id:string},unknown,unknown>,res:Response,next:NextFunction){
        try {
            const {id} = req.params
            console.log(id)
            const task = await TaskService.getSingleUserTask(id)
            return successResponse({
                response: res,
                message: 'tasks with given id fetched successfully!!',
                data: task,
            });
        } catch (error) {
            next(error)
        }
    },
     async getTaskByAssignerID(req:Request<{id:string},unknown,unknown>,res:Response,next:NextFunction){
        try {
            const {id} = req.params
           
            const task = await TaskService.getTasksByAssigner(id)
            return successResponse({
                response: res,
                message: 'tasks with given id fetched successfully!!',
                data: task,
            });
        } catch (error) {
            next(error)
        }
    },
    async updateStatus(req:Request<{id:string},unknown,{status:string}>,res:Response,next:NextFunction){
        try {
            const {id} = req.params
            const {status} = req.body
            const task = await TaskService.getSingleUserTask(id)
             if (!task) {
                throw new CustomError("sorry task not fount",404)
            }
            
            const rules: Record<string, string[]>  = {
                'Assigned':['InProgress'],
                'InProgress':['Assigned','Completed'],
                'Completed':[]
            }     
            console.log(status,task.status)
            if (!(status in rules && rules[status].includes(task.status))) {
                return errorResponse({
                    response: res,
                    message: 'K garya Vai k garya!!',
                });
            }

          
            const updated = await TaskService.updateTaskStatus(id,status)
            const userId = res.locals.user._id
            const taskId = task.id
            const TaskStatus = `${task.status} to ${status}`
            const assigner = res.locals.user.username

            const activity:Activity = {
                userId:userId,
                taskId:taskId,
                TaskStatus:TaskStatus,
                Assigner:assigner
            }
            await ActivityService.createActivity(activity)
             return successResponse({
                    response: res,
                    message: 'status updated successfully!!',
                    data: updated,
                });
            
        } catch (error) {
            next(error)
        }
    },
    async update(req:Request<{id:string},unknown,Task>,res:Response,next:NextFunction){
        try {
            const {id} = req.params
            const user = res.locals.user
            const task = await TaskService.getSingleTask(id)
             if (!task) {
                throw new CustomError("sorry task not fount",404)
            }
            if (task && task.assigner.toString() !== user._id) {
                throw new CustomError("unauthorizedd only assigner can update",403)
            }
            const updated = await TaskService.updateTask(id,req.body)
             return successResponse({
                    response: res,
                    message: 'task updated successfully!!',
                    data: updated,
                });
        } catch (error) {
            next(error)
        }
    },
    async delete(req:Request<{id:string},unknown,unknown>,res:Response,next:NextFunction){
        try {
            const {id} = req.params
            const user = res.locals.user
            const task = await TaskService.getSingleTask(id)
            if (!task) {
                throw new CustomError("sorry task not fount",404)
            }
            
             if (task && task.assigner.toString() !== user._id) {
                return errorResponse({
                    response: res,
                    message: "unauthorizedd only assigner can delete",
                    status:403
                })
            }
             await TaskService.deleteTask(id)
             return successResponse({
                    response: res,
                    message: 'task deleted successfully!!',
                });
        } catch (error) {
            next(error)
        }
    }
}