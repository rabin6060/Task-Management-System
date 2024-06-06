import { useTask } from "@/Context/TaskContext"
import { List } from "../List"


const Completed = () => {
    const {task} = useTask()
    const assigned =  task && task.filter(t=>t.status === 'Completed')
  return <List task={assigned}/>
}

export default Completed