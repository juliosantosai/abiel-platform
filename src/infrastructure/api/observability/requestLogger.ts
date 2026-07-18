function requestLogger(req, res, next) {
  const start = Date.now();
  // Log incoming request in requested format
  console.log('[REQUEST]');
  console.log('method:');
  console.log(req.method);
  console.log('path:');
  console.log(req.originalUrl || req.url);

  // Origin/CORS logging is handled by corsMiddleware
  // (this logger focuses on request/response/duration)

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log('[RESPONSE]');
    console.log('status:');
    console.log(res.statusCode);
    console.log('duration:');
    console.log(`${duration}ms`);
  });

  next();
}

module.exports = { requestLogger };
