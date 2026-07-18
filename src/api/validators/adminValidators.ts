const ApiHttpException = require('../../infrastructure/api/errors/ApiHttpException');

function parseInteger(value, defaultValue) {
  if (value === undefined || value === null || value === '') return defaultValue;
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

function validateLogs(req, res, next) {
  const { page, limit, level, from, to } = req.query;
  const errors = {};

  const p = parseInteger(page, 1);
  const l = parseInteger(limit, 50);

  if (Number.isNaN(p) || p < 1) errors.page = 'must be integer >= 1';
  if (Number.isNaN(l) || l < 1 || l > 1000) errors.limit = 'must be integer between 1 and 1000';

  if (level && typeof level !== 'string') errors.level = 'must be a string';

  // Optional ISO date validation
  if (from) {
    const d = new Date(String(from));
    if (isNaN(d.getTime())) errors.from = 'invalid date';
  }
  if (to) {
    const d = new Date(String(to));
    if (isNaN(d.getTime())) errors.to = 'invalid date';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiHttpException({ status: 400, code: 'INVALID_QUERY', message: 'Invalid query parameters', fields: errors }));
  }

  // normalize parsed values onto req for controller
  req.query.page = p;
  req.query.limit = l;
  req.query.level = level;
  req.query.from = from ? new Date(String(from)) : undefined;
  req.query.to = to ? new Date(String(to)) : undefined;

  next();
}

module.exports = { validateLogs };
