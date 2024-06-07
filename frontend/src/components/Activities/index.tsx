
import { getActivities } from "@/api/activity";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useActiveItems } from "@/Context/ActiveComponent";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from 'date-fns';

interface Activities{

_id : string
userId :string
taskId :{
  title:string
}
TaskStatus : string
Assigner :string
updatedAt:string
__v:number

}

export function Activities() {
  const { activeItem, setActiveItem } = useActiveItems();
  const [activities,setActivities] = useState<Activities[] | null>(null)

  const handleClose = () => {
    setActiveItem('');
  };

  useEffect(()=>{
    async function Activities(){
        try {
        const res = await getActivities()
        if (!res) {
            toast.error("kei aayena")
        }
        setActivities(res.data.data)
        toast.success("Activities Fetched")
    } catch (error) {
        toast.error("Sorry Malai Maaf Gara")
    }
    }
    Activities()
  },[])


  return (
    <Sheet open={activeItem === 'Activities'} onOpenChange={handleClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Activities</SheetTitle>
          <SheetDescription>
            Changes made by All Assignee
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid row-auto items-center gap-4">
            {
                activities?.map(activity=>(
                    <div key={activity._id} className="flex gap-5 shadow-md p-2">
                        <div>
                            <p className="text-slate-500">Assigner : <span className="text-teal-500">{activity.Assigner.toUpperCase()}</span></p>
                            <p className="text-slate-500">Task Title : <span className="text-teal-500">{activity.taskId?.title.toUpperCase()}</span></p>
                            <p className="text-slate-500">Activity : {activity.TaskStatus}</p>
                            <p className="text-slate-500 text-sm">UpdatedAt : <span className="text-orange-500">{format(activity.updatedAt, 'MMMM d, yyyy h:mm a')}</span></p>
                        </div>
                        
                    </div>
                ))
            }
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
