import { Task } from '@/pages/CreateTask/type';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import { getAllTask, getAllTaskByAssigner } from '@/api/task';
import { useUser } from './UserContext';
// Define a type for the context value
interface UserContextType {
  task: Task[] | [];
  setTask: (task: Task[] | []) => void;
  taskByAssigner: Task[] | [];
  settaskByAssigner: (task: Task[] | []) => void;
  singleTaskInfo: Task | null  ;
  setSingleTaskInfo: (task: Task | null) => void;
}

// Create the context with a default value
const TaskContent = createContext<UserContextType | undefined>(undefined);

// Create a provider component
const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [task, setTask] = useState<Task[] | []>([]);
  const [taskByAssigner, settaskByAssigner] = useState<Task[] | []>([]);
  const [singleTaskInfo, setSingleTaskInfo] = useState<Task | null>(null);
  const { user } = useUser();
  useEffect(() => {
    async function getTask() {
      try {
        const response = await getAllTask(user?.data?._id);
        if (response) {
          setTask(response && response.data.data);
        }
        console.log('something went wrong');
      } catch (error) {
        console.log('sorry');
      }
    }
    getTask();
  }, [user?.data?._id]);
  useEffect(() => {
    async function getTaskByAssigner() {
      try {
        const response = await getAllTaskByAssigner(user?.data._id);
        if (response) {
          settaskByAssigner(response && response.data.data);
        }
        console.log('something went wrong');
      } catch (error) {
        console.log('sorry');
      }
    }
    getTaskByAssigner();
  }, [user?.data?._id]);
  return (
    <TaskContent.Provider
      value={{ task, setTask, settaskByAssigner, taskByAssigner, singleTaskInfo, setSingleTaskInfo }}
    >
      {children}
    </TaskContent.Provider>
  );
};

// Create a custom hook to use the TaskContent
const useTask = () => {
  const context = useContext(TaskContent);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { TaskProvider, useTask };
