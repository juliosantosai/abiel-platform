function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const env = process.env.NODE_ENV || 'development';

    const devOrigin = 'http://localhost:5001';
    const prodOrigin = 'https://admin.3domef.easypanel.host';

    // Allow both production admin UI and local dev frontend optionally
    const allowedOrigins = [prodOrigin, devOrigin];

  const allowed = !!origin && allowedOrigins.includes(origin);

  // Do not log CORS origins in production to avoid exposing headers; keep behavior

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token');

  if (req.method === 'OPTIONS') {
    // Preflight: ensure we log details and return 204 with CORS headers
    return res.status(204).end();
  }

  next();
}

module.exports = { corsMiddleware };
