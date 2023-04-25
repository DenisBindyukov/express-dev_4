import {postsCollection} from "../../db/db";
import {PostType} from "../../types/db-types";
import {Collection} from "mongodb";
import {PostsAndCountByBlogIdResponseType} from "./types/types";
import {PaginationType, SortFieldType} from "../../types/ownTypes";
import {DEFAULT_SORT_FIELD} from "../../types/constants";
import {paginationHandler} from "../../../utils/paginationHandler";


class PostsQueryRepositories {
    constructor(private readonly postsCollection: Collection<PostType>) {
    }

    async getPosts(
        pageNumber: number = 1,
        pageSize: number = 10,
        searchNameTerm: string | null = null,
        sortBy: string = DEFAULT_SORT_FIELD,
        sortDirection: number
    ): Promise<PaginationType<PostType[]>> {
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

    async getPost(postId: string): Promise<PostType | null> {
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