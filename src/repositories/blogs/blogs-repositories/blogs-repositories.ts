import {blogsCollection} from "../../db/db";
import {Collection} from "mongodb";
import {BlogType} from "../../types/db-types";
import {BlogDtoType} from "../../../routs/types/blog.types";


export class _BlogsRepositories {
    constructor(private readonly blogsCollection: Collection<BlogType>) {
    }

    async createBlog(blog: BlogType): Promise<void> {
        await this.blogsCollection.insertOne(blog);
    }

    async updateBlog(id: string, dto: BlogDtoType): Promise<boolean> {
        const res = await this.blogsCollection.updateOne({id}, {$set: {...dto}});
        if (res.matchedCount) {
            return true;
        } else {
            return false;
        }
    }

    async deleteBlog(id: string): Promise<boolean> {
        const res = await this.blogsCollection.deleteOne({id});
        if (res.deletedCount) {
            return true;
        } else {
            return false;
        }
    }

    async clearCluster(): Promise<boolean> {
        await this.blogsCollection.deleteMany({})
        return true
    }
}

export default new _BlogsRepositories(blogsCollection);
