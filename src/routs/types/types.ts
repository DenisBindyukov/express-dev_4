export interface BlogDtoType {
    name: string,
    description: string,
    websiteUrl: string
}

export interface PostDtoType {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type BlogQueryParamsType = {
    pageNumber?: number
    pageSize?: number
    sortBy?: number
    sortDirection?: string
    searchNameTerm?: string | null
}

export type UrlParamsType = {
    blogId: string
}
