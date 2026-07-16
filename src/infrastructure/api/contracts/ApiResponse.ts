import { Cursor } from "./Cursor";
import { Metadata, RequestLike, createMetadata } from "./Metadata";
import { Pagination } from "./Pagination";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  pagination?: Pagination;
  cursor?: Cursor;
  metadata?: Metadata;
}

interface BuildOkInput<T> {
  req?: RequestLike;
  data: T;
  pagination?: Pagination;
  cursor?: Cursor;
  metadata?: Record<string, unknown>;
}

export function ok<T>({ req, data, pagination, cursor, metadata = {} }: BuildOkInput<T>): ApiSuccessResponse<T> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  if (cursor) {
    response.cursor = cursor;
  }

  if (Object.keys(metadata).length > 0 || req?.requestContext) {
    response.metadata = createMetadata(req, metadata);
  }

  return response;
}

export function created<T>({ req, data, metadata = {} }: { req?: RequestLike; data: T; metadata?: Record<string, unknown> }): ApiSuccessResponse<T> {
  return ok({ req, data, metadata });
}
