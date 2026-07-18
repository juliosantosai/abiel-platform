const { requestContextMiddleware } = require("../observability/requestContext");
const { requestLogger } = require("../observability/requestLogger");
const { corsMiddleware } = require("./corsMiddleware");

function registerApiPipeline(app, { rateLimiter }) {
  app.use(requestContextMiddleware);

  // CORS handling
  app.use(corsMiddleware);

  // Global request/response logger
  app.use(requestLogger);

  if (rateLimiter) {
    app.use("/api", rateLimiter.middleware());
    app.use("/api/v1", rateLimiter.middleware());
  }
}

module.exports = { registerApiPipeline };
