
import { getAllTask, getAllTaskByAssigner } from '@/api/task';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from './UserContext';
import { useTask } from './TaskContext';

// Define a type for the context value
interface ItemContextType {
  refresh: boolean
  setRefresh : (refresh:boolean) => void
  loading:boolean
  setLoading:(loading:boolean)=>void
}


// Create the context with a default value
const RefreshContext = createContext<ItemContextType | undefined>(undefined);

// Create a provider component
const RefreshProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [refresh,setRefresh] = useState<boolean>(false)
  const [loading,setLoading] = useState<boolean>(false)
  const {user} = useUser()
  const {settaskByAssigner,setTask} = useTask()
 useEffect(()=>{
    async function getTask(){
      setLoading(true)
      try {
        const response = await getAllTaskByAssigner(user?.data._id)
        if (!response) {
          toast("Sorry no tasks")
          setLoading(false)
        }
        settaskByAssigner(response?.data.data)
        setRefresh(false)
        setLoading(false)
      } catch (error) {
        toast("Fetched Error!!!")
        setLoading(false)
      }
    }
    getTask()
    async function getTasks(){
      setLoading(true)
      try {
        const response = await getAllTask(user?.data._id)
        if (!response) {
          toast("Sorry no tasks")
          setLoading(false)
        }
        setTask(response?.data.data)
        setLoading(false)
        
      } catch (error) {
        toast("Fetched Error!!!")
        setLoading(false)
      }
    }
    getTasks()
  },[refresh])
  
  return (
    <RefreshContext.Provider value={{refresh,setRefresh,loading,setLoading}}>
      {children}
    </RefreshContext.Provider>
  );
};

// Create a custom hook to use the UserContext
const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefersh must be used within a RefreshProvider');
  }
  return context;
};

export { RefreshProvider, useRefresh };
