declare const path: any;
declare const ApiHttpException: any;
declare const ValidationErrorModule: any;
declare const DomainErrorModule: any;
declare const NotFoundErrorModule: any;
declare const TenantErrorModule: any;
declare const ValidationError: any;
declare const DomainError: any;
declare const NotFoundError: any;
declare const TenantError: any;
declare function mapErrorToHttp(err: any): {
    status: any;
    code: any;
    message: any;
    fields: any;
    details: any;
} | {
    status: number;
    code: string;
    message: any;
    fields: any;
    details?: undefined;
} | {
    status: number;
    code: string;
    message: any;
    fields?: undefined;
    details?: undefined;
} | {
    status: number;
    code: string;
    message: any;
    details: {
        stack: any;
    };
    fields?: undefined;
};
//# sourceMappingURL=mapErrorToHttp.d.ts.map