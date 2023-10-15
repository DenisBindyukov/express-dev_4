export interface PaginationUsersQueryParamsType extends PaginationQueryParamsType {
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export interface PaginationQueryParamsType  {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: sortDirection
    searchNameTerm?: string | null
}

export interface PaginationType<T> {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}

export interface SortFieldType {
    [key: string]: any
}

export interface PaginationHandlerResponseType {
    countItems: number
    sortField: SortFieldType
}

type sortDirection = 'asc' | 'desc'

export enum SortType {
    asc = 1,
    desc = -1
}