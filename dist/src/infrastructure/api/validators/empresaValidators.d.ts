declare const assertNonEmptyString: any, assertOptionalString: any, assertEmail: any, ValidationError: any;
declare function validateCrearEmpresa(body?: {}): {
    nombre: any;
    email: any;
    telefono: any;
};
declare function validateActualizarEmpresa(params?: {}, body?: {}): {
    id: any;
    nombre: any;
    email: any;
    telefono: any;
};
declare function validateEmpresaId(params?: {}): {
    id: any;
};
//# sourceMappingURL=empresaValidators.d.ts.map