declare const openApiSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    paths: {
        "/demo-token": {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: undefined;
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                properties: {
                                                    token: {
                                                        type: string;
                                                    };
                                                    empresaId: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                        $ref?: undefined;
                                    })[];
                                };
                            };
                        };
                    };
                    default: {
                        $ref: string;
                    };
                };
            };
        };
        "/empresas": {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: undefined;
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                        $ref?: undefined;
                                    })[];
                                };
                            };
                        };
                    };
                    default: {
                        $ref: string;
                    };
                };
            };
        };
        "/usuarios": {
            post: {
                tags: string[];
                security: {
                    BearerAuth: any[];
                }[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: undefined;
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                        $ref?: undefined;
                                    })[];
                                };
                            };
                        };
                    };
                    default: {
                        $ref: string;
                    };
                };
            };
        };
        "/conversaciones/{id}/bloquear": {
            post: {
                tags: string[];
                security: {
                    BearerAuth: any[];
                }[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: undefined;
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                        $ref?: undefined;
                                    })[];
                                };
                            };
                        };
                    };
                    default: {
                        $ref: string;
                    };
                };
            };
        };
        "/dashboard/metricas": {
            get: {
                tags: string[];
                security: {
                    BearerAuth: any[];
                }[];
                summary: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: undefined;
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                        $ref?: undefined;
                                    })[];
                                };
                            };
                        };
                    };
                    default: {
                        $ref: string;
                    };
                };
            };
        };
    };
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            Metadata: {
                type: string;
                properties: {
                    requestId: {
                        type: string;
                        nullable: boolean;
                    };
                    correlationId: {
                        type: string;
                        nullable: boolean;
                    };
                    timestamp: {
                        type: string;
                        format: string;
                    };
                };
            };
            ProblemDetails: {
                type: string;
                properties: {
                    type: {
                        type: string;
                    };
                    title: {
                        type: string;
                    };
                    status: {
                        type: string;
                    };
                    detail: {
                        type: string;
                    };
                    instance: {
                        type: string;
                    };
                    code: {
                        type: string;
                    };
                    fields: {
                        type: string;
                        additionalProperties: boolean;
                    };
                    details: {
                        type: string;
                        additionalProperties: boolean;
                    };
                };
            };
            ApiResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        enum: boolean[];
                    };
                    data: {
                        type: string;
                        additionalProperties: boolean;
                    };
                    pagination: {
                        $ref: string;
                    };
                    cursor: {
                        $ref: string;
                    };
                    metadata: {
                        $ref: string;
                    };
                };
                required: string[];
            };
            ApiError: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        enum: boolean[];
                    };
                    error: {
                        type: string;
                    };
                    code: {
                        type: string;
                    };
                    fields: {
                        type: string;
                        additionalProperties: boolean;
                    };
                    details: {
                        type: string;
                        additionalProperties: boolean;
                    };
                    problem: {
                        $ref: string;
                    };
                    metadata: {
                        $ref: string;
                    };
                };
                required: string[];
            };
            Pagination: {
                type: string;
                properties: {
                    page: {
                        type: string;
                    };
                    pageSize: {
                        type: string;
                    };
                    totalItems: {
                        type: string;
                    };
                    totalPages: {
                        type: string;
                    };
                };
            };
            Cursor: {
                type: string;
                properties: {
                    next: {
                        type: string;
                        nullable: boolean;
                    };
                    previous: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            EmpresaCreateRequest: {
                type: string;
                properties: {
                    nombre: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    telefono: {
                        type: string;
                    };
                };
                required: string[];
            };
            UsuarioCreateRequest: {
                type: string;
                properties: {
                    empresaId: {
                        type: string;
                    };
                    nombre: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    rol: {
                        type: string;
                        enum: string[];
                    };
                };
                required: string[];
            };
            EmpresaDto: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nombre: {
                        type: string;
                    };
                    email: {
                        type: string;
                        nullable: boolean;
                    };
                    telefono: {
                        type: string;
                        nullable: boolean;
                    };
                    estado: {
                        type: string;
                        nullable: boolean;
                    };
                    plan: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            UsuarioDto: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    empresaId: {
                        type: string;
                    };
                    nombre: {
                        type: string;
                    };
                    email: {
                        type: string;
                    };
                    rol: {
                        type: string;
                    };
                    estado: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            ConversationControlDto: {
                type: string;
                additionalProperties: boolean;
            };
            DashboardMetricsDto: {
                type: string;
                additionalProperties: boolean;
            };
        };
        responses: {
            ApiErrorResponse: {
                description: string;
                content: {
                    "application/json": {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=openApiSpec.d.ts.map