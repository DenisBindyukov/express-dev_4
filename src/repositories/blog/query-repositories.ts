import {blogsCollection} from "../db/db";
import {Collection} from "mongodb";
import {BlogType} from "../types/db-types";
import {SortType} from "./types/types";
import {regex} from "uuidv4";


export class BlogsQueryRepositories {
    constructor(private readonly blogsCollection: Collection<BlogType>) {
    }

    async getBlogs(
        pageNumber: number = 1,
        pageSize: number = 10,
        searchNameTerm: string | null = null,
        sortBy: string = 'createdAt',
        sortDirection: number
    ): Promise<any> {
        //sort -1 по убыванию, 1 по возрастанию

        const formula = (pageNumber - 1) * pageSize;

        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}
        let sortField: any = {};
        sortField[sortBy] = sortDirection;

        try {
            const blogs = await this.blogsCollection.find(findNameTerm, {projection: {_id: 0}})
                .sort(sortField)
                .skip(formula)
                .limit(pageSize)
                .toArray();
            const count = await this.blogsCollection.countDocuments({});

            return {
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: count,
                items: blogs
            };
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
}

export default new BlogsQueryRepositories(blogsCollection);
