import {uuid} from "uuidv4";
import {PostType} from "../repositories/types/db-types";
import PostsRepositories from "../repositories/posts/posts-repositories";
import BlogsService from "./blogs-service";
import {PostDtoType} from "../repositories/posts/types/types";


class PostsService {
    constructor(
        private readonly postsRepositories: typeof PostsRepositories,
        private readonly blogsService: typeof BlogsService,
    ) {
    }

    async getPosts() {
        return await this.postsRepositories.getPosts()
    }

    async getPost(postId: string) {
        return await this.postsRepositories.getPost(postId)
    }

    async createPost(dto: PostDtoType): Promise<PostType | null> {
        const blog = await this.blogsService.getBlogById(dto.blogId);

        if (blog) {
            const newPost: PostType = {
                id: uuid(),
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId,
                blogName: blog.name,
                createdAt: new Date()
            }
            await this.postsRepositories.createPost(newPost)
            return await this.postsRepositories.getPost(newPost.id)
        } else {
            return null
        }
    }

    async updatePost(postId: string, dto: PostDtoType): Promise<boolean | string> {
        const post = await this.getPost(postId);
        if (!post) {
            return false
        }
        const updatedPost = {
            ...post,
            ...dto
        }
        return await this.postsRepositories.updatePost(postId,updatedPost)
    }

    async deletePost(postId: string): Promise<boolean> {
        return await this.postsRepositories.deletePost(postId)
    }

    async clearCluster(): Promise<boolean> {
      return await this.postsRepositories.clearCluster()

    }
}

export default new PostsService(PostsRepositories, BlogsService)