import {blogsCollection} from "../../../db/db";
import {Collection} from "mongodb";
import {BlogDBType} from "../../../db/types/db-types";
import {BlogDtoType} from "../../../routs/blogs/types/blog.types";


export class _BlogsRepositories {
    constructor(private readonly blogsCollection: Collection<BlogDBType>) {
    }

    async createBlog(blog: BlogDBType): Promise<void> {
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
