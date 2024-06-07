import { Task } from '@/pages/CreateTask/type';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {  deleteTasks, singleTask } from '@/api/task';
import { toast } from 'sonner';
import axios from 'axios';
import {format} from 'date-fns'

import { useActiveItems } from '@/Context/ActiveComponent';
import { useTask } from '@/Context/TaskContext';
import { addComment, deleteComment } from '@/api/comment';
import { MdDelete } from "react-icons/md";
import { useUser } from '@/Context/UserContext';
// Adjust the import path as needed

interface TaskDetailProps {
  task: Task | null | undefined;
  setShowDetail: (showDetail: boolean) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, setShowDetail }) => {
  const { setSingleTaskInfo,singleTaskInfo } = useTask();
  const { setShowUpdate } = useActiveItems();
  const {user} = useUser()
  const [comment,setComment] = useState<string>('')

  
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteTasks(id);
      if (!res) {
        toast.error('Oops. Not Deleted');
      }
      setShowDetail(false);
      toast.success('Deleted !!!');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data?.message);
        }
      }
    }
  };
  const handleEdit = async (id: string) => {
    try {
      const res = await singleTask(id);
      if (!res) {
        toast.error('Oops. Not task');
      }
      setSingleTaskInfo(res && res.data.data);
      setShowDetail(false);
      setShowUpdate(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data?.message);
        }
      }
    }
  };

  const handleAdd = async(e:any) => {
    e.preventDefault()
    setComment('')
    try {
      const res = await addComment(task?._id,comment)
      if (!res) {
        toast.error("sorry cannot be added!!!")
      }
      setShowDetail(false)
      toast.success('Added SuccessFully!!!')
    } catch (error) {
      toast.error('Sorry We got a Error!!!')
    }
  }
  const handleDeleteComment = async(taskId:string,id:string) =>{
    try {
      const res = await deleteComment(taskId,id)
      if (!res) {
        toast.error("Oops not deleted")
      }
      setShowDetail(false)
      toast.success('Comment Deleted SuccessFully!!')
    } catch (error) {
      toast.error('Sorry Error Not Deleted')
    }
  }

const taskDueDate = new Date(task?.dueDate || '');
const now = new Date();

if (isNaN(taskDueDate.getTime()) || isNaN(now.getTime())) {
  console.error("Invalid date");
  return (
    <p className="text-slate-500 text-xl">
      <strong>Due Date: <span className='text-red-500'>Invalid date</span></strong>
    </p>
  );
}


const diffInMs = taskDueDate.getTime() - now.getTime();


const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

let differenceText;
if (diffInDays > 0) {
  differenceText = `${diffInDays} days, ${diffInHours} hours, and ${diffInMinutes} minutes remaining`;
} else if (diffInHours > 0) {
  differenceText = `${diffInHours} hours and ${diffInMinutes} minutes remaining`;
} else if (diffInMinutes > 0) {
  differenceText = `${diffInMinutes} minutes remaining`;
} else {
  differenceText = 'Due date has passed';
}

console.log(user?.data._id===task?.assigner)
  return (
    <div className={`inset-0 fixed w-full h-auto bg-gray-900 bg-opacity-50 flex justify-end items-center z-50`}>
      {task && (
        <div className="bg-white w-full h-full sm:max-w-[30%] p-6 rounded-lg shadow-lg space-y-5">
          <h2 className="text-5xl font-bold mb- text-teal-500">Task Details</h2>
          <p className="text-slate-500 text-xl">
            Title: <span className='text-lg'>{task?.title.toUpperCase()}</span>
          </p>
          <div className='space-y-2'>
            <h3 className="text-slate-500 text-xl">Description:</h3>
            <p className='text-sm text-slate-400'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ratione nobis odit cupiditate quis, modi repudiandae officiis adipisci, esse quibusdam, fugit ipsa quidem sed aut deserunt ea recusandae omnis delectus.
            </p>
           
          </div>
          <p className="text-slate-500 text-xl">
            Status: {task?.status}
          </p>
          <div className=" outline-none flex items-center  gap-2">
            <p className='text-slate-500 text-xl'>Priority:</p>
            <select className='p-2 rounded-lg'>
              <option value="#" className='text-slate-500'>{task?.priority}</option>
            </select> 
          </div>
          <p className="text-slate-500 text-xl">
            Due Date: <span className='text-red-500'>{differenceText}</span>
          </p>
          <p className="text-slate-500 text-xl">
            Assigner: <span className='bg-slate-100 p-2 rounded-full ml-2 uppercase'>{task?.assigner?.username} </span> 
          </p>
          <p className="text-slate-500 text-xl">
            Tags:
            <span className='bg-slate-100 p-2 rounded-full ml-2'>{task?.tags?.join(', ')}</span>
             
          </p>
          <form className='flex gap-3'>
            <div className='flex items-center gap-3'>
              <label className='text-slate-500 text-xl'>Add Comment:</label>
              <input type="text" placeholder='add a comment' className='p-2 border outline-none' onChange={(e)=>setComment(e.target.value)} />
            </div>
            <Button type='submit' onClick={(e)=>handleAdd(e)} className='bg-teal-500 hover:bg-purple-500 w-auto'>Add</Button>
          </form>
          <div className='flex flex-col gap-2 h-[300px] overflow-y-scroll'>
            {
              task.comments.map(comment=>(
                <div key={comment._id} className='bg-slate-50 shadow-md p-2 space-y-2'>
                  <p className='text-slate-500 text-[14px]'>Comment: <span className='text-teal-500'>{comment.content}</span></p>
                  <p className='text-orange-500 text-sm'>{format(comment?.createdAt, 'MMMM d, yyyy h:mm a')}</p>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center justify-center gap-2 cursor-pointer border p-1 border-red-500 rounded-lg' onClick={()=>handleDeleteComment(task._id,comment?._id)}>
                      <MdDelete type='button' className='text-2xl text-red-500' /> <span className='text-red-500'>Delete</span>
                    </div>
                    <p className='text-slate-500'>Added by : <span className='text-teal-500'>{comment.user}</span></p>
                  </div>
                  
                </div>
              ))
            }
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              
              className="bg-teal-500 text-white text-xl px-4 py-2 rounded hover:bg-purple-500"
              onClick={() => setShowDetail(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              disabled = {!(user?.data._id===task?.assigner._id)}
              className=" bg-red-500 text-white text-xl px-4 py-2 rounded hover:bg-purple-500"
              onClick={() => handleDelete(task._id)}
            >
              Delete
            </Button>
            <Button
              type="button"
              disabled = {!(user?.data._id===task.assigner._id)}
              className=" bg-orange-500 text-white text-xl px-4 py-2 rounded hover:bg-purple-500"
              onClick={() => handleEdit(task._id)}
            >
              Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
