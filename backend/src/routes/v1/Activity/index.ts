import { Router } from 'express';
import {ActivityController} from './controller';


const ActivityRouter = Router();



// Login
ActivityRouter.route('/').post(ActivityController.create);
ActivityRouter.route('/').get(ActivityController.get);

export default ActivityRouter;
