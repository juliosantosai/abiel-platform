const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Abiel Core API",
    version: "1.0.0",
    description: "Transport adapter HTTP for Abiel Core framework.",
  },
  servers: [
    { url: "/api/v1", description: "Versioned API" },
    { url: "/api", description: "Compatibility alias" },
  ],
  tags: [
    { name: "health", description: "Platform health" },
    { name: "auth", description: "Authentication helpers" },
    { name: "empresa", description: "Empresa lifecycle" },
    { name: "usuario", description: "Usuario lifecycle" },
    { name: "conversacion", description: "Conversation control" },
    { name: "dashboard", description: "Dashboard metrics and activity" },
  ],
  paths: {
    "/demo-token": {
      get: {
        tags: ["auth"],
        summary: "Generate demo JWT token",
        parameters: [
          {
            name: "empresaId",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Demo token generated",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            token: { type: "string" },
                            empresaId: { type: "string" },
                          },
                          required: ["token", "empresaId"],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: { $ref: "#/components/responses/ApiErrorResponse" },
        },
      },
    },
    "/empresas": {
      post: {
        tags: ["empresa"],
        summary: "Crear empresa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmpresaCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Empresa creada",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/EmpresaDto" },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: { $ref: "#/components/responses/ApiErrorResponse" },
        },
      },
    },
    "/usuarios": {
      post: {
        tags: ["usuario"],
        security: [{ BearerAuth: [] }],
        summary: "Crear usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UsuarioCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuario creado",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/UsuarioDto" },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: { $ref: "#/components/responses/ApiErrorResponse" },
        },
      },
    },
    "/conversaciones/{id}/bloquear": {
      post: {
        tags: ["conversacion"],
        security: [{ BearerAuth: [] }],
        summary: "Bloquear conversación",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Conversación bloqueada",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/ConversationControlDto" },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: { $ref: "#/components/responses/ApiErrorResponse" },
        },
      },
    },
    "/dashboard/metricas": {
      get: {
        tags: ["dashboard"],
        security: [{ BearerAuth: [] }],
        summary: "Obtener métricas",
        responses: {
          "200": {
            description: "Métricas globales",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/DashboardMetricsDto" },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: { $ref: "#/components/responses/ApiErrorResponse" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Metadata: {
        type: "object",
        properties: {
          requestId: { type: "string", nullable: true },
          correlationId: { type: "string", nullable: true },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      ProblemDetails: {
        type: "object",
        properties: {
          type: { type: "string" },
          title: { type: "string" },
          status: { type: "integer" },
          detail: { type: "string" },
          instance: { type: "string" },
          code: { type: "string" },
          fields: { type: "object", additionalProperties: true },
          details: { type: "object", additionalProperties: true },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [true] },
          data: { type: "object", additionalProperties: true },
          pagination: { $ref: "#/components/schemas/Pagination" },
          cursor: { $ref: "#/components/schemas/Cursor" },
          metadata: { $ref: "#/components/schemas/Metadata" },
        },
        required: ["success", "data"],
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [false] },
          error: { type: "string" },
          code: { type: "string" },
          fields: { type: "object", additionalProperties: true },
          details: { type: "object", additionalProperties: true },
          problem: { $ref: "#/components/schemas/ProblemDetails" },
          metadata: { $ref: "#/components/schemas/Metadata" },
        },
        required: ["success", "error"],
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer" },
          pageSize: { type: "integer" },
          totalItems: { type: "integer" },
          totalPages: { type: "integer" },
        },
      },
      Cursor: {
        type: "object",
        properties: {
          next: { type: "string", nullable: true },
          previous: { type: "string", nullable: true },
        },
      },
      EmpresaCreateRequest: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          email: { type: "string", format: "email" },
          telefono: { type: "string" },
        },
        required: ["nombre"],
      },
      UsuarioCreateRequest: {
        type: "object",
        properties: {
          empresaId: { type: "string" },
          nombre: { type: "string" },
          email: { type: "string", format: "email" },
          rol: { type: "string", enum: ["OWNER", "ADMIN", "OPERADOR", "LECTOR"] },
        },
        required: ["empresaId", "nombre", "email", "rol"],
      },
      EmpresaDto: {
        type: "object",
        properties: {
          id: { type: "string" },
          nombre: { type: "string" },
          email: { type: "string", nullable: true },
          telefono: { type: "string", nullable: true },
          estado: { type: "string", nullable: true },
          plan: { type: "string", nullable: true },
        },
      },
      UsuarioDto: {
        type: "object",
        properties: {
          id: { type: "string" },
          empresaId: { type: "string" },
          nombre: { type: "string" },
          email: { type: "string" },
          rol: { type: "string" },
          estado: { type: "string", nullable: true },
        },
      },
      ConversationControlDto: {
        type: "object",
        additionalProperties: true,
      },
      DashboardMetricsDto: {
        type: "object",
        additionalProperties: true,
      },
    },
    responses: {
      ApiErrorResponse: {
        description: "Error response envelope",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" },
          },
        },
      },
    },
  },
};

module.exports = { openApiSpec };
