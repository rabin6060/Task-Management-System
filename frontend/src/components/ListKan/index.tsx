import { useState } from "react"
import { List } from "../List";
import {Kanban} from "../Kanban";
import { useTask } from "@/Context/TaskContext";

const ListKan = () => {
    const [activeItem,setActiveItem] = useState<string>('list')
    const {task} = useTask()
    const getItemClasses = (item: string) =>
    ` cursor-pointer py-2 px-4 ${
      activeItem === item ? 'bg-teal-500 text-white font-semibold' : ''
    }`;

  return (
    <section className="h-full">
        <div className="w-full h-full flex flex-col gap-5">
            <div className="w-[200px] bg-slate-100 shadow-md rounded-full flex items-center justify-center gap-2 overflow-hidden">
                <div   className={`${getItemClasses('list')} cursor-pointer w-1/2 text-center`}
                onClick={() => setActiveItem('list')}>
                        List
                </div>
                <div   className={`${getItemClasses('kanban')} w-1/2 text-center`}
                onClick={() => setActiveItem('kanban')}>
                    Kanban
                </div>
            </div>
            <div>
                {
                    activeItem === 'list' 
                    ? <List task={task}/>
                    : <Kanban/>
                }
            </div>
        </div>
    </section>
  )
}

export default ListKan