export interface Pagination {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
}

export function createPagination({ page, pageSize, totalItems, totalPages }: Pagination): Pagination {
  return { page, pageSize, totalItems, totalPages };
}
