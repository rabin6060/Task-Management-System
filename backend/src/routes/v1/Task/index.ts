import { Router } from 'express';
import { TaskController } from './controller';
import requireUser from '../../../Middleware/requireUser';

const TaskRouter = Router({ mergeParams: true });

TaskRouter.route('/')
  .post(TaskController.create)


TaskRouter.route('/:id')
  .get(TaskController.getTasks)
  .patch(requireUser, TaskController.update)
  .delete(requireUser,TaskController.delete)

TaskRouter.route('/:id/status')
  .patch(requireUser,TaskController.updateStatus);

TaskRouter.route('/:id/task')
  .get(TaskController.getTask)

TaskRouter.route('/:id/taskbyassigner')
  .get(TaskController.getTaskByAssignerID)


export default TaskRouter;
