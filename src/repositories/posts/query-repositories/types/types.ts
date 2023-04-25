import {PostType} from "../../../types/db-types";

export interface PostsAndCountByBlogIdResponseType {
    count: number,
    items: PostType[]
}