declare class PublicCatalogService {
    getPlans(): Promise<{
        items: {
            code: string;
            name: string;
            monthlyPrice: number;
            currency: string;
        }[];
    }>;
    signup(payload?: {}): Promise<{
        status: string;
        companyName: any;
        email: any;
    }>;
    requestDemo(payload?: {}): Promise<{
        status: string;
        email: any;
        requestedAt: string;
    }>;
}
//# sourceMappingURL=PublicCatalogService.d.ts.map