declare function createApiError({ problem, metadata }: {
    problem: any;
    metadata: any;
}): {
    success: boolean;
    error: {
        code: any;
        message: any;
    };
    code: any;
    fields: any;
    details: any;
    problem: any;
    metadata: any;
    timestamp: string;
};
//# sourceMappingURL=ApiError.d.ts.map