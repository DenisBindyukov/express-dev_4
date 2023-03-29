import {uuid} from 'uuidv4';
import {BlogDtoType} from "../routs/types/types";
import {BlogType} from "../repositories/types/db-types";
import BlogsRepositories from "../repositories/blogs-repositories";


export class _BlogsService {
    constructor(private readonly blogsCollection: typeof BlogsRepositories) {
    }

    async getBlogs(): Promise<BlogType [] | null> {
        return await this.blogsCollection.getBlogs()
    }

    async getBlogById(id: string): Promise<BlogType | null> {
        return await this.blogsCollection.getBlogById(id)
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
        return await this.blogsCollection.getBlogById(newBlog.id);
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

export default new _BlogsService(BlogsRepositories);
