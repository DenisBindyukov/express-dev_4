import {uuid} from 'uuidv4';
import {blogsCollection} from "./db/db";
import {Collection} from "mongodb";
import {BlogType} from "./types/db-types";
import {BlogDtoType} from "../routs/types/types";

export class _BlogsRepositories {
    constructor(private readonly blogsCollection: Collection<BlogType>) {
    }

    async getBlogs(): Promise<BlogType [] | null> {
        try {
            const res = this.blogsCollection.find({}, {projection: {_id: 0}}).toArray();
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }

    }

    async getBlogById(id: string): Promise<BlogType | null> {
        const res = await this.blogsCollection.find({id}, {projection: {_id: 0}}).next();
        if (res) {
            return res;
        } else {
            return null;
        }
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

        await this.blogsCollection.insertOne(newBlog);
        const blog = await this.blogsCollection.find({id: newBlog.id}, {projection: {_id: 0}}).next();
        if (blog) {
            return blog;
        } else return null;
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
        try {
            await this.blogsCollection.deleteMany({})
            return true
        } catch (e) {
            console.log(e)
            return false
        }

    }
}

export default new _BlogsRepositories(blogsCollection);
