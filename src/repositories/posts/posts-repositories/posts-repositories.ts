import {postsCollection} from "../../db/db";
import {PostType} from "../../types/db-types";
import {Collection} from "mongodb";


class PostsRepositories {
    constructor(private readonly postsCollection: Collection<PostType>) {
    }

    async createPost(post: PostType): Promise<void> {
        await this.postsCollection.insertOne(post)
    }

    async updatePost(postId: string, post: PostType): Promise<boolean | string> {
        const result = await this.postsCollection.updateOne({id: postId}, {$set: {...post}});
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

export default new PostsRepositories(postsCollection)