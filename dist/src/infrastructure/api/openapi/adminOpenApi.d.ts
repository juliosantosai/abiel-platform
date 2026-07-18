declare const adminOpenApi: {
    paths: {
        "/api/admin/logs": {
            get: {
                summary: string;
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: undefined;
                        enum?: undefined;
                        format?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        enum?: undefined;
                        format?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum: string[];
                        minimum?: undefined;
                        default?: undefined;
                        maximum?: undefined;
                        format?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                        minimum?: undefined;
                        default?: undefined;
                        maximum?: undefined;
                        enum?: undefined;
                    };
                })[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
                security: {
                    adminToken: any[];
                }[];
            };
        };
        "/api/admin/metrics": {
            get: {
                summary: string;
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
                security: {
                    adminToken: any[];
                }[];
            };
        };
        "/api/admin/architecture": {
            get: {
                summary: string;
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
                security: {
                    adminToken: any[];
                }[];
            };
        };
        "/api/admin/architecture/modules": {
            get: {
                summary: string;
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
                security: {
                    adminToken: any[];
                }[];
            };
        };
    };
    components: {
        securitySchemes: {
            adminToken: {
                type: string;
                in: string;
                name: string;
            };
        };
        schemas: {
            LogItem: {
                type: string;
                properties: {
                    message: {
                        type: string;
                    };
                    level: {
                        type: string;
                        enum: string[];
                    };
                    occurredAt: {
                        type: string;
                        format: string;
                    };
                    context: {
                        type: string;
                        additionalProperties: boolean;
                    };
                };
            };
            MetricsSnapshot: {
                type: string;
                properties: {
                    startedAt: {
                        type: string;
                        format: string;
                    };
                    eventsPublished: {
                        type: string;
                    };
                    capabilitiesRegistered: {
                        type: string;
                    };
                    cpu: {
                        type: string;
                        nullable: boolean;
                    };
                    ram: {
                        type: string;
                    };
                    heap: {
                        type: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=adminOpenApi.d.ts.map