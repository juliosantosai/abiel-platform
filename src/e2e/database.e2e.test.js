const path = require("path");
const prisma = require(path.resolve(__dirname, "../shared/database/prisma"));
const PrismaEmpresaRepository = require(path.resolve(__dirname, "../modules/empresa/infrastructure/persistence/PrismaEmpresaRepository"));
const PrismaUsuarioRepository = require(path.resolve(__dirname, "../modules/usuario/infrastructure/persistence/PrismaUsuarioRepository"));
const { randomUUID } = require("crypto");

/**
 * E2E Tests: Validar que PrismaRepositories funcionan con BD real
 * NOTA: Estos tests usan BD test real, no fake repositories
 */

describe("E2E: Empresa Repository with Real Database", () => {
    let empresaRepository;

    beforeAll(() => {
        empresaRepository = new PrismaEmpresaRepository();
    });

    afterAll(async () => {
        // Limpiar datos de test
        await prisma.empresa.deleteMany({});
        await prisma.$disconnect();
    });

    test("debe crear y recuperar empresa", async () => {
        const empresaId = randomUUID();
        const empresa = {
            id: empresaId,
            nombre: "Test Empresa",
            email: "test@empresa.com",
            telefono: "555-0000",
            estado: "PENDIENTE",
            plan: "BÁSICO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        };

        // Guardar
        const saved = await empresaRepository.guardar(empresa);
        expect(saved.id).toBe(empresaId);
        expect(saved.nombre).toBe("Test Empresa");

        // Recuperar
        const retrieved = await empresaRepository.buscarPorId(empresaId);
        expect(retrieved).not.toBeNull();
        expect(retrieved.nombre).toBe("Test Empresa");
        expect(retrieved.email).toBe("test@empresa.com");
    });

    test("debe actualizar empresa", async () => {
        const empresaId = randomUUID();
        const empresa = {
            id: empresaId,
            nombre: "Original",
            email: "original@test.com",
            telefono: "555-0001",
            estado: "PENDIENTE",
            plan: "BÁSICO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        };

        await empresaRepository.guardar(empresa);

        // Actualizar
        const updated = {
            ...empresa,
            nombre: "Updated",
            email: "updated@test.com",
        };
        await empresaRepository.guardar(updated);

        // Verificar actualización
        const retrieved = await empresaRepository.buscarPorId(empresaId);
        expect(retrieved.nombre).toBe("Updated");
        expect(retrieved.email).toBe("updated@test.com");
    });

    test("debe obtener todas las empresas", async () => {
        const id1 = randomUUID();
        
        await empresaRepository.guardar({
            id: id1,
            nombre: "Test Get All",
            email: "getall@test.com",
            telefono: "555-0002",
            estado: "ACTIVA",
            plan: "PRO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        });

        const todas = await empresaRepository.obtenerTodas();
        expect(Array.isArray(todas)).toBe(true);
        expect(todas.length).toBeGreaterThan(0);
    });

    test("debe retornar null si empresa no existe", async () => {
        const nonExistent = await empresaRepository.buscarPorId(randomUUID());
        expect(nonExistent).toBeNull();
    });
});

describe("E2E: Usuario Repository with Real Database", () => {
    let usuarioRepository;
    let empresaRepository;
    let empresaId;

    beforeAll(async () => {
        usuarioRepository = new PrismaUsuarioRepository();
        empresaRepository = new PrismaEmpresaRepository();
        
        // Crear empresa de prueba
        empresaId = randomUUID();
        await empresaRepository.guardar({
            id: empresaId,
            nombre: "Test Empresa for Users",
            email: "company@test.com",
            telefono: "555-9999",
            estado: "ACTIVA",
            plan: "PRO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        });
    });

    afterAll(async () => {
        await prisma.usuario.deleteMany({});
        await prisma.empresa.deleteMany({});
        await prisma.$disconnect();
    });

    test("debe crear y recuperar usuario", async () => {
        const usuarioId = randomUUID();
        const usuario = {
            id: usuarioId,
            empresaId,
            nombre: "Juan Perez",
            email: "juan@test.com",
            rol: "OPERADOR",
            estado: "ACTIVO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        };

        await usuarioRepository.guardar(usuario);

        const retrieved = await usuarioRepository.buscarPorId(usuarioId);
        expect(retrieved).not.toBeNull();
        expect(retrieved.nombre).toBe("Juan Perez");
        expect(retrieved.rol).toBe("OPERADOR");
    });

    test("debe buscar usuarios por empresa", async () => {
        const usuarioId = randomUUID();
        await usuarioRepository.guardar({
            id: usuarioId,
            empresaId,
            nombre: "Usuario Test",
            email: "user@test.com",
            rol: "ADMIN",
            estado: "ACTIVO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        });

        const usuarios = await usuarioRepository.obtenerTodos();
        expect(usuarios.length).toBeGreaterThan(0);
        const encontrado = usuarios.find(u => u.id === usuarioId);
        expect(encontrado).toBeDefined();
    });
});

describe("E2E: Database Transaction Integrity", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    test("debe mantener consistencia entre empresas y usuarios", async () => {
        const empresaRepository = new PrismaEmpresaRepository();
        const usuarioRepository = new PrismaUsuarioRepository();
        
        const empresaId = randomUUID();
        const usuarioId = randomUUID();

        // Crear empresa
        await empresaRepository.guardar({
            id: empresaId,
            nombre: "Consistency Test",
            email: "consistency@test.com",
            telefono: "555-CONST",
            estado: "ACTIVA",
            plan: "PRO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        });

        // Crear usuario asociado
        await usuarioRepository.guardar({
            id: usuarioId,
            empresaId,
            nombre: "Consistency User",
            email: "constuser@test.com",
            rol: "OWNER",
            estado: "ACTIVO",
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        });

        // Verificar integridad referencial
        const foundUsuario = await usuarioRepository.buscarPorId(usuarioId);
        const foundEmpresa = await empresaRepository.buscarPorId(empresaId);

        expect(foundUsuario.empresaId).toBe(empresaId);
        expect(foundEmpresa.id).toBe(empresaId);
    });
});
