declare const ApiResponse: any;
declare const validateConversationId: any;
declare const toConversationControlDto: any;
declare class ConversationControlController {
    constructor({ bloquearConversacionUseCase, cerrarConversacionUseCase }: {
        bloquearConversacionUseCase: any;
        cerrarConversacionUseCase: any;
    });
    bloquear(req: any, res: any, next: any): Promise<any>;
    cerrar(req: any, res: any, next: any): Promise<any>;
}
//# sourceMappingURL=ConversationControlController.d.ts.map