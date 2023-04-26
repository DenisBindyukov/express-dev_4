import {uuid} from 'uuidv4';
import {BlogType, PostType} from "../repositories/types/db-types";
import BlogsRepositories from "../repositories/blogs/blogs-repositories/blogs-repositories";
import BlogsQueryRepositories from "../repositories/blogs/query-repositories/query-repositories";
import PostsService from './post-service';
import {PostDtoType} from "../repositories/posts/posts-repositories/types/types";
import {BlogDtoType} from "../routs/types/types";


export class _BlogsService {
    constructor(
        private readonly blogsCollection: typeof BlogsRepositories,
        private readonly blogsQueryRepositories: typeof BlogsQueryRepositories,
        private readonly postsService: typeof PostsService,
    ) {
    }

    async createBlog(dto: BlogDtoType): Promise<BlogType | null> {
        const newBlog = {
            id: uuid(),
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }

        await this.blogsCollection.createBlog(newBlog);
        return await this.blogsQueryRepositories.getBlogById(newBlog.id);
    }

    async createPostByBlogId(dto: PostDtoType): Promise<PostType | null> {
       return await this.postsService.createPost(dto);
    }

    async updateBlog(id: string, dto: BlogDtoType): Promise<boolean> {
        return await this.blogsCollection.updateBlog(id, dto);

    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsCollection.deleteBlog(id);

    }

    async clearCluster(): Promise<boolean> {
        return await this.blogsCollection.clearCluster()
    }
}

export default new _BlogsService(BlogsRepositories, BlogsQueryRepositories, PostsService);
