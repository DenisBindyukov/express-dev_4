import {uuid} from "uuidv4";
import {PostType} from "../repositories/types/db-types";
import PostsRepository from "../repositories/posts/posts-repositories/posts-repositories";
import BlogsQueryRepository from "../repositories/blogs/query-repositories/query-repositories";
import PostsQueryRepository from "../repositories/posts/query-repositories/query-repositories";
import {PostDtoType} from "../repositories/posts/posts-repositories/types/types";


class PostsService {
    constructor(
        private readonly postsRepository: typeof PostsRepository,
        private readonly postsQueryRepository: typeof PostsQueryRepository,
        private readonly blogsQueryRepository: typeof BlogsQueryRepository,
    ) {
    }

    async createPost(dto: PostDtoType): Promise<PostType | null> {
        const blog = await this.blogsQueryRepository.getBlogById(dto.blogId!);

        if (blog) {
            const newPost: PostType = {
                id: uuid(),
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId!,
                blogName: blog.name,
                createdAt: new Date()
            }
            await this.postsRepository.createPost(newPost)
            return await this.postsQueryRepository.getPost(newPost.id)
        } else {
            return null
        }
    }

    async updatePost(postId: string, dto: PostDtoType): Promise<boolean | string> {
        const post = await this.postsQueryRepository.getPost(postId);
        if (!post) {
            return false
        }
        const updatedPost = {
            ...post,
            ...dto
        }
        return await this.postsRepository.updatePost(postId, updatedPost)
    }

    async deletePost(postId: string): Promise<boolean> {
        return await this.postsRepository.deletePost(postId)
    }

    async clearCluster(): Promise<boolean> {
        return await this.postsRepository.clearCluster()

    }
}

export default new PostsService(PostsRepository, PostsQueryRepository, BlogsQueryRepository)