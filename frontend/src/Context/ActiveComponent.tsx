
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a type for the context value
interface ItemContextType {
  activeItem: string | undefined
  setActiveItem: (activeItem:string) => void
  showUpdate: boolean
  setShowUpdate : (showUpdate:boolean) => void
  show: boolean
  setShow : (show:boolean) => void
}


// Create the context with a default value
const ActiveContext = createContext<ItemContextType | undefined>(undefined);

// Create a provider component
const ActiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeItem,setActiveItem] = useState<string | undefined>('Home')
  const [showUpdate,setShowUpdate] = useState<boolean>(false)
  const [show,setShow] = useState<boolean>(false)
  return (
    <ActiveContext.Provider value={{ activeItem,setActiveItem ,showUpdate,setShowUpdate,show,setShow}}>
      {children}
    </ActiveContext.Provider>
  );
};

// Create a custom hook to use the UserContext
const useActiveItems = () => {
  const context = useContext(ActiveContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { ActiveProvider, useActiveItems };
