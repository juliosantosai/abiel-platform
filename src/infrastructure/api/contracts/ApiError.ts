import { Metadata } from "./Metadata";
import { ProblemDetails } from "./ProblemDetails";

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  fields?: Record<string, unknown>;
  details?: Record<string, unknown>;
  problem?: ProblemDetails;
  metadata?: Metadata;
}

export function createApiError({
  problem,
  metadata,
}: {
  problem?: ProblemDetails;
  metadata?: Metadata;
}): ApiErrorResponse {
  return {
    success: false,
    error: problem?.title || "Error",
    code: problem?.code,
    fields: problem?.fields,
    details: problem?.details,
    problem,
    metadata,
  };
}
