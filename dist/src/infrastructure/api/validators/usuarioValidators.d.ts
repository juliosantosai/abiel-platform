declare const assertNonEmptyString: any, assertOptionalString: any, assertEmail: any, ValidationError: any;
declare const VALID_ROLES: string[];
declare function validateCrearUsuario(body?: {}): {
    empresaId: any;
    nombre: any;
    email: any;
    rol: any;
};
declare function validateActualizarUsuario(params?: {}, body?: {}): {
    id: any;
    nombre: any;
    email: any;
    rol: any;
};
declare function validateUsuarioId(params?: {}): {
    id: any;
};
//# sourceMappingURL=usuarioValidators.d.ts.map