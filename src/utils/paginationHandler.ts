import {PaginationHandlerResponseType, SortFieldType} from "../routs/blogs/types/pagination-types";

export function paginationHandler(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: number
): PaginationHandlerResponseType {
//find how many count to need to skip items
    const countItems = (pageNumber - 1) * pageSize;

    let sortField: SortFieldType = {};
    sortField[sortBy] = sortDirection;

    return {
        countItems,
        sortField
    }
}