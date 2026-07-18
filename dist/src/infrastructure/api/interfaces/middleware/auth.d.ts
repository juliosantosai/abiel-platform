declare const jwt: any;
declare const path: any;
declare const ApiError: any, createMetadata: any, createProblemDetails: any;
declare const ApiHttpException: any;
declare const mapErrorToHttp: any;
declare const TenantContext: any;
/**
 * Obtiene JWT_SECRET - valida en tiempo de ejecución en lugar de en tiempo de carga
 */
declare function getJwtSecret(): string;
/**
 * Middleware: Extrae y valida el JWT, guarda empresaId como tenantContext.
 */
declare function autenticar(req: any, res: any, next: any): any;
/**
 * Middleware: Mapea errores del dominio a respuestas HTTP estandarizadas.
 */
declare function manejarErrores(err: any, req: any, res: any, next: any): any;
//# sourceMappingURL=auth.d.ts.map