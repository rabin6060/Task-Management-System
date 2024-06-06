import { Router } from 'express';

import Health from './Health';
import UserRouter from './Users';
import AuthRouter from './Auth';
import TaskRouter from './Task';
import TagRouter from './Tag';
import CommentsRouter from './Comment';
import ActivityRouter from './Activity';

const router = Router();

router.use('/health', Health);
router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/activities', ActivityRouter);
router.use('/tasks/:taskId/comments',CommentsRouter)
router.use('/tags', TagRouter);
router.use('/tasks', TaskRouter);

/**
 * Import and add your routes here
 * Eg:
 *   router.use('/[route-name]', [Route]);
 */

export default router;
