import { useTask } from "@/Context/TaskContext"
import { List } from "../List"


const CreatedTask = () => {
    const {taskByAssigner} = useTask()
  return <List task={taskByAssigner}/>
}

export default CreatedTask