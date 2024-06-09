import { Router } from 'express';

import Health from './Health';
import UserRouter from './Users';
import AuthRouter from './Auth';
import TaskRouter from './Task';
import CommentsRouter from './Comment';
import ActivityRouter from './Activity';

const router = Router();

router.use('/health', Health);
router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/activities', ActivityRouter);
router.use('/tasks/:taskId/comments',CommentsRouter)
router.use('/tasks', TaskRouter);



export default router;
