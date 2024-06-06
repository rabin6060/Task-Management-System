import { Router } from 'express';
import PostsController from './controller';
import { requireUser } from '../../../Middleware/requireUser';
import { allowRoles } from '../../../Middleware/validateRole';
import { UserRoles } from '../../../enums/user-roles.enums';

const PostRouter = Router();

// Get All the posts
PostRouter.route('/').get(requireUser, allowRoles([UserRoles.USER]), PostsController.getPosts);

// Get one post
PostRouter.route('/:id').get(requireUser, PostsController.getPost);

// Create new post
PostRouter.route('/').post(requireUser, PostsController.createPost);

// Update a post
PostRouter.route('/:id').patch(requireUser, PostsController.updatePost);

// Delete a post
PostRouter.route('/:id').delete(requireUser, PostsController.deletePost);

export default PostRouter;
