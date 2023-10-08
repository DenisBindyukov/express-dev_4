import {blogsCollection} from "../../../db/db";
import {Collection} from "mongodb";
import PostsQueryRepositories from '../../posts/query-repositories/query-repository';
import {PaginationType} from "../../../routs/blogs/types/pagination-types";
import {BlogDBType, PostDBType} from "../../../db/types/db-types";
import {DEFAULT_SORT_FIELD} from "../../../routs/blogs/types/constants";
import {paginationHandler} from "../../../utils/paginationHandler";

export class BlogsQueryRepositories {
    constructor(
        private readonly blogsCollection: Collection<BlogDBType>,
        private readonly postsQueryRepositories: typeof PostsQueryRepositories
    ) {
    }

    async getBlogById(id: string): Promise<BlogDBType | null> {
        const res = await this.blogsCollection.find({id}, {projection: {_id: 0}}).next();
        if (res) {
            return res;
        } else {
            return null;
        }
    }

    async getBlogs(
        pageNumber: number = 1,
        pageSize: number = 10,
        searchNameTerm: string | null = null,
        sortBy: string = DEFAULT_SORT_FIELD,
        sortDirection: number
    ): Promise<PaginationType<BlogDBType[]>> {
        //sort -1 по убыванию, 1 по возрастанию

        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const count = await this.blogsCollection.countDocuments(findNameTerm);
        const blogs = await this.blogsCollection.find(findNameTerm, {projection: {_id: 0}})
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .toArray();

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: blogs
        };
    }

    async getPostsByBlogId(
        blogId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = DEFAULT_SORT_FIELD,
        sortDirection: number
    ): Promise<PaginationType<PostDBType[]>> {

        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const res = await this.postsQueryRepositories.getPostsAndCountByBlogId(blogId, sortField, countItems, pageSize);

        return {
            pagesCount: Math.ceil(res.count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: res.count,
            items: res.items
        }
    }
}

export default new BlogsQueryRepositories(blogsCollection, PostsQueryRepositories);
