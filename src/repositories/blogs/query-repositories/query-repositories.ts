import {blogsCollection} from "../../db/db";
import {Collection} from "mongodb";
import PostsQueryRepositories from '../../posts/query-repositories/query-repositories';
import {PaginationType} from "../../types/ownTypes";
import {BlogType, PostType} from "../../types/db-types";
import {DEFAULT_SORT_FIELD} from "../../types/constants";
import {paginationHandler} from "../../../utils/paginationHandler";

export class BlogsQueryRepositories {
    constructor(
        private readonly blogsCollection: Collection<BlogType>,
        private readonly postsQueryRepositories: typeof PostsQueryRepositories
    ) {
    }

    async getBlogById(id: string): Promise<BlogType | null> {
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
    ): Promise<PaginationType<BlogType[]>> {
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
    ): Promise<PaginationType<PostType[]>> {

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
