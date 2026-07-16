export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  fields?: Record<string, unknown>;
  details?: Record<string, unknown>;
}

export function createProblemDetails({
  type = "about:blank",
  title,
  status,
  detail,
  instance,
  code,
  fields,
  details,
}: ProblemDetails): Required<Pick<ProblemDetails, "type">> & Omit<ProblemDetails, "type"> {
  return {
    type,
    title,
    status,
    detail,
    instance,
    code,
    fields,
    details,
  };
}
