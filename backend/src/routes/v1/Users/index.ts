import { Router } from 'express';
import UserController from './controller';
import {rateLimit} from 'express-rate-limit'

const UserRouter = Router();
const limiter = rateLimit({
    windowMs:1*60*1000,
    limit:5,
    message:'too many request please wait for a while!!'
})
// Get All the users
UserRouter.route('/').get(UserController.getUsers);

// Get one user
UserRouter.route('/:id').get(UserController.getUser);

// Get me route

// Create new user
UserRouter.route('/').post(UserController.createUser);
UserRouter.route('/verify/:email').post(limiter,UserController.verifyUser);

// Update a user
 UserRouter.route('/:id')
 .patch(UserController.update)
 .delete(UserController.delete)

// Delete a post
// UserRouter.route('/:id').delete();

export default UserRouter;
