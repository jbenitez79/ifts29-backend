const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Pruebas de Integración - Todos los Endpoints REST", () => {
  afterAll(async () => {
    // Cerramos la conexión a la base de datos para que Jest no se quede colgado
    await mongoose.connection.close();
  });

  describe("Endpoints de Clientes (/clientes)", () => {
    it("GET /clientes - debería devolver 200", async () => {
      const res = await request(app).get("/clientes");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Endpoints de Proveedores (/proveedores)", () => {
    it("GET /proveedores - debería devolver 200", async () => {
      const res = await request(app).get("/proveedores");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Endpoints de Productos (/productos)", () => {
    it("GET /productos - debería devolver 200", async () => {
      const res = await request(app).get("/productos");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Endpoints de Pedidos (/pedidos)", () => {
    it("GET /pedidos - debería devolver 200", async () => {
      const res = await request(app).get("/pedidos");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Endpoints de Cuentas Corrientes (/cuentas)", () => {
    it("GET /cuentas - debería devolver 200", async () => {
      const res = await request(app).get("/cuentas");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
