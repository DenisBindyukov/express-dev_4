import {PostDBType} from "../../../../db/types/db-types";

export interface PostsAndCountByBlogIdResponseType {
    count: number,
    items: PostDBType[]
}