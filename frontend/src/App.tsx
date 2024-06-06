import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/VerifyUser';
import Home from './pages/Home';
import Protected from './components/Protected';
import { Toaster } from "@/components/ui/sonner";
import { DndContext } from '@dnd-kit/core';

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path='signup' element={<Signup />} />
        <Route path='verify/:email' element={<Verify />} />
        <Route path='login' element={<Login />} />
        <Route element={<Protected />} >
          <Route path='/' element={
            <DndContext onDragEnd={handleDragEnd}>
              <Home />
            </DndContext>
          } />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

const handleDragEnd = (event:any) => {
  // Handle the drag end event here
  console.log(event);
};

export default App;
