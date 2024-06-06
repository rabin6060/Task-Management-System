import { useTask } from "@/Context/TaskContext"
import { List } from "../List"
import { useUser } from "@/Context/UserContext"


const Assigned = () => {
    const {task} = useTask()
    const {user} = useUser()
    console.log(user)
    const assigned = task && task.filter(t=>t.status === 'Assigned')
  return <List task={assigned}/>
}

export default Assigned