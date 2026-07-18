declare const createMetadata: any;
declare function ok({ req, data, pagination, cursor, metadata }: {
    req: any;
    data: any;
    pagination: any;
    cursor: any;
    metadata?: {};
}): {
    success: boolean;
    data: any;
    timestamp: string;
};
declare function created({ req, data, metadata }: {
    req: any;
    data: any;
    metadata?: {};
}): {
    success: boolean;
    data: any;
    timestamp: string;
};
//# sourceMappingURL=ApiResponse.d.ts.map