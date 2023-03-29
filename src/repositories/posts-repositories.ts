import {postsCollection} from "./db/db";
import {PostType} from "./types/db-types";
import {Collection} from "mongodb";
import {PostDtoType} from "../routs/types/types";
import {uuid} from "uuidv4";
import BlogsRepositories, {_BlogsRepositories} from "./blogs-repositories";

class PostsRepositories {
    constructor(
        private readonly postsCollection: Collection<PostType>,
        private readonly blogsRepositories: _BlogsRepositories
    ) {
    }

    async getPosts() {
        return this.postsCollection.find({}, {projection: {_id: 0}}).toArray()
    }

    async getPost(postId: string) {
        return await this.postsCollection.find({id: postId}, {projection: {_id: 0}}).next()

    }

    async createPost(dto: PostDtoType): Promise<PostType | null> {
        const blog = await this.blogsRepositories.getBlogById(dto.blogId);

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
            await this.postsCollection.insertOne(newPost)
            const createdBlog = await this.postsCollection.find(
                {id: newPost.id},
                {projection: {_id: 0}}
            ).next();
            return createdBlog
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
        const result = await this.postsCollection.updateOne({id: postId}, {$set: {...updatedPost}});
        if (result.matchedCount) {
            return true
        } else {
            return false
        }
    }

    async deletePost(postId: string): Promise<boolean> {
        const result = await this.postsCollection.deleteOne({id: postId});
        if (result.deletedCount) {
            return true;
        } else {
            return false;
        }
    }

    async clearCluster(): Promise<boolean> {
        try {
            await this.postsCollection.deleteMany({})
            return true
        } catch (e) {
            console.log(e)
            return false
        }

    }
}

export default new PostsRepositories(postsCollection, BlogsRepositories)