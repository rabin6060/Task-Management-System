import { useTask } from "@/Context/TaskContext"
import { List } from "../List"


const Progress = () => {
    const {task} = useTask()
    const assigned =  task && task.filter(t=>t.status === 'InProgress')
  return <List task={assigned}/>
}

export default Progress