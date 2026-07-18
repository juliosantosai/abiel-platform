const { requestContextMiddleware } = require("../observability/requestContext");

function registerApiPipeline(app, { rateLimiter }) {
  app.use(requestContextMiddleware);

  if (rateLimiter) {
    app.use("/api", rateLimiter.middleware());
    app.use("/api/v1", rateLimiter.middleware());
  }
}

module.exports = { registerApiPipeline };
