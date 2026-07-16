function createPagination({ page, pageSize, totalItems, totalPages }) {
  return { page, pageSize, totalItems, totalPages };
}

module.exports = { createPagination };
