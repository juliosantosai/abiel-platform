"use strict";
const adminOpenApi = {
    paths: {
        "/api/admin/logs": {
            get: {
                summary: "Get server logs with pagination and filters",
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 1000, default: 50 } },
                    { name: "level", in: "query", schema: { type: "string", enum: ["debug", "info", "warn", "error"] } },
                    { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
                    { name: "to", in: "query", schema: { type: "string", format: "date-time" } },
                ],
                responses: {
                    "200": { description: "Paginated logs list" },
                    "400": { description: "Bad Request" },
                    "401": { description: "Unauthorized" },
                },
                security: [{ adminToken: [] }],
            },
        },
        "/api/admin/metrics": {
            get: {
                summary: "Get runtime and aggregated metrics",
                responses: { "200": { description: "Metrics snapshot" }, "401": { description: "Unauthorized" } },
                security: [{ adminToken: [] }],
            },
        },
        "/api/admin/architecture": {
            get: {
                summary: "Get architecture discovery overview",
                responses: { "200": { description: "Architecture overview" }, "401": { description: "Unauthorized" } },
                security: [{ adminToken: [] }],
            },
        },
        "/api/admin/architecture/modules": {
            get: {
                summary: "Get discovered admin modules and runtime module status",
                responses: { "200": { description: "Module discovery" }, "401": { description: "Unauthorized" } },
                security: [{ adminToken: [] }],
            },
        },
    },
    components: {
        securitySchemes: {
            adminToken: { type: "apiKey", in: "header", name: "x-admin-token" },
        },
        schemas: {
            LogItem: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    level: { type: "string", enum: ["debug", "info", "warn", "error"] },
                    occurredAt: { type: "string", format: "date-time" },
                    context: { type: "object", additionalProperties: true },
                },
            },
            MetricsSnapshot: {
                type: "object",
                properties: {
                    startedAt: { type: "string", format: "date-time" },
                    eventsPublished: { type: "integer" },
                    capabilitiesRegistered: { type: "integer" },
                    cpu: { type: "number", nullable: true },
                    ram: { type: "integer" },
                    heap: { type: "integer" },
                },
            },
        },
    },
};
module.exports = { adminOpenApi };
//# sourceMappingURL=adminOpenApi.js.map