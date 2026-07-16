function createProblemDetails({
  type = "about:blank",
  title,
  status,
  detail,
  instance,
  code,
  fields,
  details,
}) {
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

module.exports = { createProblemDetails };
