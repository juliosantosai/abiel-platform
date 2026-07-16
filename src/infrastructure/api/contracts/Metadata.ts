export interface Metadata {
  requestId?: string;
  correlationId?: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface RequestLike {
  requestContext?: {
    requestId?: string;
    correlationId?: string;
  };
}

export function createMetadata(req?: RequestLike, extra: Record<string, unknown> = {}): Metadata {
  return {
    requestId: req?.requestContext?.requestId,
    correlationId: req?.requestContext?.correlationId,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}
