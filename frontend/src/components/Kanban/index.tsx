import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Droppable } from '../Droppable';
import { Draggable } from '../Draggable';
import { useTask } from '@/Context/TaskContext';
import { toast } from 'sonner';
import { updateStatus } from '@/api/task';
import axios from 'axios';
import { format } from 'date-fns';
import { useRefresh } from '@/Context/RefreshPage';


export function Kanban() {
   const container = [
    { status: 'Assigned',color:'text-red-500'},
    { status: 'InProgress',color:'text-yellow-500' },
    { status: 'Completed',color:'text-teal-500'}
  ];
  const { task: taskData } = useTask();
  const [tasks, setTasks] = useState(taskData);
  const {setRefresh} = useRefresh()

  const handleDragEnd = async (event:any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeTask = tasks.find((task) => task._id === active.id);
      if (!activeTask) {
        console.error('Active task not found');
        return;
      }

      
      const fromStatus = activeTask.status;
      const toStatus = over.id;
      
      
      // Updating the task status locally before making the API call
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === active.id ? { ...task, status: toStatus } : task
        )
      );

      try {
        const response = await updateStatus(active.id, toStatus);
        if (response) {
        toast.success('Updated successfully!');
        setRefresh(true)
      }
        
      } catch (error) {
        // Revert the status change locally if the API call fails
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === active.id ? { ...task, status: fromStatus } : task
          )
        );

        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  const renderTasks = (status:string) =>
   tasks && tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <Draggable key={task._id} id={task._id}>
          <div className='bg-slate-100 h-auto rounded-lg mb-2 p-2 text-slate-500 hover:bg-slate-300 hover:text-white capitalize'>
            <h1>Title: {task.title}</h1>
            <p>Desc: {task.desc}</p>
            <p>Status: {task.status}</p>
            <p className='text-sm'>DueDate: {format(task.dueDate, 'MMMM d, yyyy h:mm a')}</p>
          </div>
        </Draggable>
      ));

  return (
      <DndContext onDragEnd={handleDragEnd}>
      <div className='grid grid-cols-3 gap-4'>
        {container.map(({ status,color }) => (
          <Droppable key={status} id={status}>
            <div className={`min-h-screen space-y-2 p-2 rounded-lg bg-white shadow-lg`}>
              <h1 className={`text-2xl font-bold ${color}`}>{status}</h1>
              <div>{renderTasks(status)}</div>
            </div>
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
}