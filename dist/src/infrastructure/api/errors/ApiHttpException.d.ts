declare class ApiHttpException extends Error {
    constructor({ status, code, message, details, fields, cause }: {
        status?: number;
        code?: string;
        message?: string;
        details: any;
        fields: any;
        cause: any;
    });
}
//# sourceMappingURL=ApiHttpException.d.ts.map