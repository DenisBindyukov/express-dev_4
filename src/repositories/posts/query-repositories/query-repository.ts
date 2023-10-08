import {postsCollection} from "../../../db/db";
import {PostDBType} from "../../../db/types/db-types";
import {Collection} from "mongodb";
import {PostsAndCountByBlogIdResponseType} from "./types/types";
import {PaginationType, SortFieldType} from "../../../routs/blogs/types/pagination-types";
import {DEFAULT_SORT_FIELD} from "../../../routs/blogs/types/constants";
import {paginationHandler} from "../../../utils/paginationHandler";


class PostsQueryRepositories {
    constructor(private readonly postsCollection: Collection<PostDBType>) {
    }

    async getPosts(
        pageNumber: number = 1,
        pageSize: number = 10,
        searchNameTerm: string | null = null,
        sortBy: string = DEFAULT_SORT_FIELD,
        sortDirection: number
    ): Promise<PaginationType<PostDBType[]>> {
        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection);

        const count = await this.postsCollection.countDocuments();
        const posts = await this.postsCollection.find({}, {projection: {_id: 0}})
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .toArray();

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: posts
        };
    }

    async getPost(postId: string): Promise<PostDBType | null> {
        return await this.postsCollection.find({id: postId}, {projection: {_id: 0}}).next()

    }

    async getPostsAndCountByBlogId(blogId: string, sortField: SortFieldType, countItems: number, pageSize: number): Promise<PostsAndCountByBlogIdResponseType> {
        const count = await this.postsCollection.countDocuments({blogId});
        const items = await this.postsCollection.find({blogId}, {projection: {_id: 0}})
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .toArray();

        return {
            count,
            items
        }
    }
}

export default new PostsQueryRepositories(postsCollection)