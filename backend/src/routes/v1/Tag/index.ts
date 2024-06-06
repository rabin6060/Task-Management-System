import { Router } from 'express';
import { TagController } from './controller';


const TagRouter = Router({mergeParams:true});

TagRouter.route('/').post(TagController.create)
TagRouter.route('/').get(TagController.getTags)

export default TagRouter;
