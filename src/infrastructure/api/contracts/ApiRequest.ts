import { RequestLike } from "./Metadata";

export interface ApiRequest {
  path: string;
  method: string;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  body: Record<string, unknown>;
  tenantContext: unknown;
  user: unknown;
  requestContext: unknown;
}

export interface HttpRequestLike extends RequestLike {
  path: string;
  method: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  tenantContext?: unknown;
  usuario?: unknown;
}

export function createApiRequest(req: HttpRequestLike): ApiRequest {
  return {
    path: req.path,
    method: req.method,
    params: req.params || {},
    query: req.query || {},
    body: req.body || {},
    tenantContext: req.tenantContext || null,
    user: req.usuario || null,
    requestContext: req.requestContext || null,
  };
}
