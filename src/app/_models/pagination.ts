export interface Pagination{
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T>{
    result: T = {} as any;
    pagination: Pagination = {} as any;
}