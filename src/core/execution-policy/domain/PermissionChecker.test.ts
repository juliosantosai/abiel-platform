export {};

const PermissionChecker = require("./PermissionChecker");

describe("PermissionChecker", () => {
    test("permite cuando todos los permisos existen", () => {
        const checker = new PermissionChecker();
        const result = checker.check({ permissions: ["a", "b"] }, ["a"]);
        expect(result.allowed).toBe(true);
        expect(result.missing).toEqual([]);
    });

    test("bloquea cuando faltan permisos", () => {
        const checker = new PermissionChecker();
        const result = checker.check({ permissions: ["a"] }, ["a", "b"]);
        expect(result.allowed).toBe(false);
        expect(result.missing).toEqual(["b"]);
    });
});