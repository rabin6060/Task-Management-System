import { PostDocument } from './model';

export interface PostQuery {
  page?: string;
  limit?: string;
  sort?: string;
  title?: string;
}

export interface PostsReturn {
  posts: PostDocument[];
  totalPosts: number;
  page: number;
  totalPage: number;
}
