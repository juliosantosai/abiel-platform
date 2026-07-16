const request = require("supertest");
const express = require("express");
const ExpressApp = require("./ExpressApp");
const jwt = require("jsonwebtoken");

describe("Express App Integration Tests", () => {
    let app;
    let mockUseCases;
    const TEST_JWT_SECRET = "test-secret-key";

    beforeEach(() => {
        process.env.JWT_SECRET = TEST_JWT_SECRET;
        mockUseCases = {
            crearEmpresaUseCase: { execute: jest.fn() },
            actualizarEmpresaUseCase: { execute: jest.fn() },
            activarEmpresaUseCase: { execute: jest.fn() },
            suspenderEmpresaUseCase: { execute: jest.fn() },
            cancelarEmpresaUseCase: { execute: jest.fn() },
            crearUsuarioUseCase: { execute: jest.fn() },
            actualizarUsuarioUseCase: { execute: jest.fn() },
            activarUsuarioUseCase: { execute: jest.fn() },
            suspenderUsuarioUseCase: { execute: jest.fn() },
            cancelarUsuarioUseCase: { execute: jest.fn() },
            bloquearConversacionUseCase: { execute: jest.fn() },
            cerrarConversacionUseCase: { execute: jest.fn() },
            obtenerMetricasGlobalesUseCase: { execute: jest.fn() },
            obtenerActividadRecienteUseCase: { execute: jest.fn() },
        };

        const expressApp = new ExpressApp(mockUseCases);
        app = expressApp.app;
    });

    describe("Health Check", () => {
        test("GET / debe retornar señal de vida", async () => {
            const res = await request(app).get("/");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true, message: "API Root OK" });
        });

        test("GET /api/demo-token debe retornar token JWT válido", async () => {
            const res = await request(app).get("/api/demo-token");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(typeof res.body.data.token).toBe("string");
            expect(typeof res.body.data.empresaId).toBe("string");

            const decoded = jwt.verify(res.body.data.token, TEST_JWT_SECRET);
            expect(decoded.empresaId).toBe(res.body.data.empresaId);
            expect(decoded.usuarioId).toBe("user-demo");
        });

        test("GET /dashboard debe retornar HTML", async () => {
            const res = await request(app).get("/dashboard");
            expect(res.status).toBe(200);
            expect(res.text).toContain("<title>Abiel Core Dashboard</title>");
        });

        test("GET /health debe retornar estado OK", async () => {
            const res = await request(app).get("/health");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true, message: "API Health OK" });
        });
    });

    describe("Empresas Endpoints", () => {
        test("POST /api/empresas debe crear empresa sin autenticación", async () => {
            const empresa = { id: "e1", nombre: "Acme", email: "contact@acme.com", estado: "PENDIENTE" };
            mockUseCases.crearEmpresaUseCase.execute.mockResolvedValue(empresa);

            const res = await request(app)
                .post("/api/empresas")
                .send({ nombre: "Acme", email: "contact@acme.com", telefono: "555-1234" });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ success: true, data: empresa });
        });

        test("PUT /api/empresas/:id debe requerir autenticación", async () => {
            const res = await request(app)
                .put("/api/empresas/e1")
                .send({ nombre: "Acme Corp", email: "new@acme.com" });

            expect(res.status).toBe(401);
        });

        test("PUT /api/empresas/:id debe actualizar con token válido", async () => {
            const token = jwt.sign({ empresaId: "e1" }, TEST_JWT_SECRET);
            const empresa = { id: "e1", nombre: "Acme Corp", email: "new@acme.com" };
            mockUseCases.actualizarEmpresaUseCase.execute.mockResolvedValue(empresa);

            const res = await request(app)
                .put("/api/empresas/e1")
                .set("Authorization", `Bearer ${token}`)
                .send({ nombre: "Acme Corp", email: "new@acme.com" });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true, data: empresa });
        });

        test("POST /api/empresas/:id/activar debe requerir autenticación", async () => {
            const res = await request(app).post("/api/empresas/e1/activar");

            expect(res.status).toBe(401);
        });

        test("POST /api/empresas/:id/activar debe activar con token válido", async () => {
            const token = jwt.sign({ empresaId: "e1" }, TEST_JWT_SECRET);
            const empresa = { id: "e1", estado: "ACTIVA" };
            mockUseCases.activarEmpresaUseCase.execute.mockResolvedValue(empresa);

            const res = await request(app)
                .post("/api/empresas/e1/activar")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true, data: empresa });
        });
    });

    describe("Usuarios Endpoints", () => {
        test("POST /api/usuarios debe requerir autenticación", async () => {
            const res = await request(app)
                .post("/api/usuarios")
                .send({ empresaId: "e1", nombre: "Juan", email: "juan@acme.com", rol: "OPERADOR" });

            expect(res.status).toBe(401);
        });

        test("POST /api/usuarios debe crear con token válido", async () => {
            const token = jwt.sign({ empresaId: "e1" }, TEST_JWT_SECRET);
            const usuario = { id: "u1", empresaId: "e1", nombre: "Juan", email: "juan@acme.com", rol: "OPERADOR", estado: "ACTIVO" };
            mockUseCases.crearUsuarioUseCase.execute.mockResolvedValue(usuario);

            const res = await request(app)
                .post("/api/usuarios")
                .set("Authorization", `Bearer ${token}`)
                .send({ empresaId: "e1", nombre: "Juan", email: "juan@acme.com", rol: "OPERADOR" });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ success: true, data: usuario });
        });
    });

    describe("Conversaciones Endpoints", () => {
        test("POST /api/conversaciones/:id/bloquear debe requerir autenticación", async () => {
            const res = await request(app).post("/api/conversaciones/c1/bloquear");

            expect(res.status).toBe(401);
        });

        test("POST /api/conversaciones/:id/bloquear debe bloquear con token válido", async () => {
            const token = jwt.sign({ empresaId: "e1" }, TEST_JWT_SECRET);
            const resultado = { conversacionId: "c1", control: "HUMAN_LOCKED" };
            mockUseCases.bloquearConversacionUseCase.execute.mockResolvedValue(resultado);

            const res = await request(app)
                .post("/api/conversaciones/c1/bloquear")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true, data: resultado });
        });
    });

    describe("Error Handling", () => {
        test("debe retornar 404 para rutas no encontradas", async () => {
            const res = await request(app).get("/api/nonexistent");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ success: false, error: "Ruta no encontrada" });
        });

        test("debe retornar 500 para errores internos", async () => {
            const token = jwt.sign({ empresaId: "e1" }, TEST_JWT_SECRET);
            mockUseCases.crearEmpresaUseCase.execute.mockRejectedValue(new Error("DB error"));

            const res = await request(app)
                .post("/api/empresas")
                .send({ nombre: "Test" });

            // Los errores de create se pasan al next sin autenticación, por lo que no van al manejarErrores
            // Esta prueba verifica que la app no crash
            expect(res.status).toBe(500);
        });
    });
});
