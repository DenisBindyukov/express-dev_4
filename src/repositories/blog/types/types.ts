export const ASC = 'asc';
export const DESC = 'desc';

export interface BlogDtoType {
    name: string,
    description: string,
    websiteUrl: string
}

export type BlogQueryParamsType = {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: sortDirection
    searchNameTerm?: string | null
}

export type UrlParamsType = {
    blogId: string
}

type sortDirection = 'asc' | 'desc'

export enum SortType {
    asc = 1,
    desc = -1
}