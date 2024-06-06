import { Button } from '@/components/ui/button';
import Task from '../CreateTask';
import { GrTasks } from 'react-icons/gr';
import { FaHome } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import { GrInProgress } from 'react-icons/gr';
import { FaCheckSquare } from 'react-icons/fa';
//import { List } from "@/components/List";
import ListKan from '@/components/ListKan';
import Assigned from '@/components/Assigned';
import Progress from '@/components/Progress';
import Completed from '@/components/Completed';
import { useTask } from '@/Context/TaskContext';
import { useActiveItems } from '@/Context/ActiveComponent';
import { FaThList } from 'react-icons/fa';
import CreatedTask from '@/components/CreatedTask';
import UpdateTask from '../UpdateTask';
import { Activities } from '@/components/Activities';

const Home = () => {
  const { show, setShow,showUpdate,setShowUpdate } = useActiveItems();
  const { activeItem, setActiveItem } = useActiveItems();
  
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  const { task, taskByAssigner,singleTaskInfo } = useTask();
  const assigned = task && task.filter(t => t.status === 'Assigned');
  const progress = task && task.filter(t => t.status === 'InProgress');
  const completed = task && task.filter(t => t.status === 'Completed');
  const getItemClasses = (item: string) =>
    `flex items-center gap-2 ml-5 p-2 rounded-lg cursor-pointer ${activeItem === item ? 'bg-gray-200' : ''}`;
  
  return (
    <section className="h-[92vh] relative">
      <div className="w-full h-full mx-auto grid grid-cols-6 gap-2 py-2">
        <div className="col-span-1 flex flex-col gap-6 p-4 bg-slate-100 shadow-md">
          <div className="text-teal-500 text-lg font-[900]">Task Management</div>
          <div className="flex items-center justify-between" onClick={() => setShow(true)}>
            <Button className="bg-teal-500 text-lg hover:bg-purple-500">Create Task</Button>
            <IoMdAddCircle className="text-teal-500 text-5xl cursor-pointer hover:text-purple-500" />
          </div>
          <div
            className={`fixed right-0 top-0 bg-slate-300 z-50 w-1/4 h-screen overflow-y-auto transition-transform duration-300 ease-in-out transform ${
              show ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <Button
              type="button"
              onClick={() => setShow(false)}
              className="absolute top-10 right-10 h-12 w-12 rounded-full bg-teal-500 hover:bg-purple-500 "
            >
              <ImCross className="text-white w-20 h-20" />
            </Button>
            <div className="h-full z-50">
              <Task />
            </div>
          </div>
          <div
            className={`fixed right-0 top-0 bg-slate-300 z-50 w-1/4 h-screen overflow-y-auto transition-transform duration-300 ease-in-out transform ${
              showUpdate ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <Button
              type="button"
              onClick={() => {
                setShow(false)
                setShowUpdate(false)
                }}
              className="absolute top-10 right-10 h-12 w-12 rounded-full bg-teal-500 hover:bg-purple-500 "
            >
              <ImCross className="text-white w-20 h-20" />
            </Button>
            <div className="h-full z-50">
             {singleTaskInfo && <UpdateTask />}
            </div>
          </div>

          <div className="text-teal-500 text-lg font-[900]">Menu</div>
          <div className={getItemClasses('Home')} onClick={() => handleItemClick('Home')}>
            <div className="text-red-500 text-lg font-[600]">
              <FaHome />
            </div>
            <div className="w-full text-teal-500 text-lg font-[600] flex items-center justify-between">
              <span>Home</span>
              <span className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
                {task && task.length}
              </span>
            </div>
          </div>
          <div className={getItemClasses('Assigned')} onClick={() => handleItemClick('Assigned')}>
            <div className="text-red-500 text-lg font-[600]">
              <GrTasks />
            </div>
            <div className="w-full text-teal-500 text-lg font-[600] flex items-center justify-between">
              <span>Assigned</span>
              <span className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
                {assigned && assigned.length}
              </span>
            </div>
          </div>
          <div className={getItemClasses('InProgress')} onClick={() => handleItemClick('InProgress')}>
            <div className="text-red-500 text-lg font-[600]">
              <GrInProgress />
            </div>
            <div className="w-full text-teal-500 text-lg font-[600] flex items-center justify-between">
              <span>In Progress</span>
              <span className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
                {progress && progress.length}
              </span>
            </div>
          </div>
          <div className={getItemClasses('Completed')} onClick={() => handleItemClick('Completed')}>
            <div className="text-red-500 text-lg font-[600]">
              <FaCheckSquare />
            </div>
            <div className="w-full text-teal-500 text-lg font-[600] flex items-center justify-between">
              <span>Completed</span>
              <span className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
                {completed && completed.length}
              </span>
            </div>
          </div>
          <div className={getItemClasses('TaskCreated')} onClick={() => handleItemClick('TaskCreated')}>
            <div className="text-red-500 text-xl font-[600]">
              <FaThList />
            </div>
            <div className="w-full text-teal-500 text-lg font-[600] flex items-center justify-between">
              <span>Created Task</span>
              <span className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
                {taskByAssigner && taskByAssigner.length}
              </span>
            </div>
          </div>
          <Button type='button' onClick={() => handleItemClick('Activities')} className='bg-teal-500 hover:bg-purple-500'>
            Show Activities
          </Button>
        </div>
        <div className="col-span-5 p-2 ">
          {activeItem === 'Home' ? (
            <ListKan />
          ) : activeItem === 'Assigned' ? (
            <Assigned />
          ) : activeItem === 'InProgress' ? (
            <Progress />
          ) : activeItem === 'TaskCreated' ? (
            <CreatedTask />
          ) : activeItem==='Activities' ?
            <Activities/>
            :
          (
            <Completed />
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
