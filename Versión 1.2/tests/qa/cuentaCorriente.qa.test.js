const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const CuentaCorriente = require("../../models/CuentaCorriente");
const Cliente = require("../../models/Cliente");

describe("QA E2E - Modelo Cuenta Corriente (/cuentas)", () => {
  let cuentaIdQA;
  let clienteId;
  const cuitQA = "QA-666666666-6";

  beforeAll(async () => {
    // 1. Crear dependencia: Cliente QA
    await Cliente.findOneAndDelete({ cuit: cuitQA });
    const cliente = await Cliente.create({
      nombre: "Cliente Cuenta QA",
      apellido: "Test",
      email: "cuenta_qa@test.com",
      telefono: "11111111",
      cuit: cuitQA,
      domicilio: "Calle",
      localidad: "CABA",
      provincia: "BA",
      pais: "Arg",
      codigoPostal: "1000",
      fechaNacimiento: "1990-01-01"
    });
    clienteId = cliente._id;
  });

  afterAll(async () => {
    // Limpiar Cuenta Corriente QA
    if (cuentaIdQA) {
      await CuentaCorriente.findByIdAndDelete(cuentaIdQA);
    }
    // Limpiar Cliente
    await Cliente.findByIdAndDelete(clienteId);
    
    await mongoose.connection.close();
  });

  it("POST /cuentas - Debería crear una cuenta corriente QA", async () => {
    const cuentaData = {
      cliente: clienteId,
      limiteCredito: 50000
    };

    const res = await request(app).post("/cuentas").send(cuentaData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.saldo).toBe(0); // Por defecto
    
    cuentaIdQA = res.body._id;
  });

  it("GET /cuentas - Debería listar la cuenta corriente QA creada", async () => {
    const res = await request(app).get("/cuentas");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    const encontrado = res.body.find(c => c._id.toString() === cuentaIdQA.toString());
    expect(encontrado).toBeDefined();
  });

  it("GET /cuentas/cliente/:idCliente - Debería traer la cuenta del cliente QA", async () => {
    const res = await request(app).get(`/cuentas/cliente/${clienteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(cuentaIdQA.toString());
  });

  it("POST /cuentas/cargo - Debería registrar un cargo y aumentar el saldo", async () => {
    const cargoData = {
      idCliente: cuentaIdQA,
      monto: 500,
      descripcion: "Cargo QA"
    };

    const res = await request(app).post("/cuentas/cargo").send(cargoData);
    expect(res.statusCode).toBe(200);
    expect(res.body.cuenta.saldo).toBe(500); // 0 + 500
  });

  it("POST /cuentas/pago - Debería registrar un pago y disminuir el saldo", async () => {
    const pagoData = {
      idCliente: cuentaIdQA,
      monto: 200,
      descripcion: "Pago QA"
    };

    const res = await request(app).post("/cuentas/pago").send(pagoData);
    expect(res.statusCode).toBe(200);
    expect(res.body.cuenta.saldo).toBe(300); // 500 - 200
  });

  it("POST /cuentas/eliminar/:id - Debería eliminar la cuenta corriente QA", async () => {
    // Primero dejamos el saldo en 0 para poder eliminarla (regla de negocio del controlador)
    await request(app).post("/cuentas/pago").send({ idCliente: cuentaIdQA, monto: 300 });

    // La API usa POST para eliminar según las rutas
    const res = await request(app).post(`/cuentas/eliminar/${cuentaIdQA}`);
    expect(res.statusCode).toBe(200);

    const verifyRes = await request(app).get(`/cuentas/cliente/${clienteId}`);
    expect(verifyRes.statusCode).toBe(404);
    
    cuentaIdQA = null;
  });
});
