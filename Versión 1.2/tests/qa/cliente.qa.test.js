const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Cliente = require("../../models/Cliente");

describe("QA E2E - Modelo Cliente (/clientes)", () => {
  let clienteIdQA;
  const cuitQA = "QA-999999999-9";
  
  const clienteData = {
    nombre: "QA Nombre",
    apellido: "QA Apellido",
    email: "qa_cliente@test.com",
    telefono: "1100000000",
    cuit: cuitQA,
    domicilio: "Calle QA 123",
    localidad: "Ciudad QA",
    provincia: "Provincia QA",
    pais: "País QA",
    codigoPostal: "9999",
    fechaNacimiento: "1990-01-01"
  };

  afterAll(async () => {
    // Limpieza estricta: borrar SOLO el cliente insertado en estas pruebas QA
    if (clienteIdQA) {
      await Cliente.findByIdAndDelete(clienteIdQA);
    } else {
      // Fallback por si falló a medias
      await Cliente.findOneAndDelete({ cuit: cuitQA });
    }
    await mongoose.connection.close();
  });

  it("POST /clientes - Debería crear un cliente QA", async () => {
    // Asegurarse de que no exista previamente de un run fallido
    await Cliente.findOneAndDelete({ cuit: cuitQA });

    const res = await request(app).post("/clientes").send(clienteData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nombre).toBe(clienteData.nombre);
    
    clienteIdQA = res.body._id; // Guardamos el ID para limpieza y otros tests
  });

  it("GET /clientes - Debería listar el cliente QA creado", async () => {
    const res = await request(app).get("/clientes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    // Validar que el cliente QA está en la lista
    const clienteEncontrado = res.body.find(c => c.cuit === cuitQA);
    expect(clienteEncontrado).toBeDefined();
    expect(clienteEncontrado._id).toBe(clienteIdQA);
  });

  it("GET /clientes/:id - Debería traer el detalle del cliente QA", async () => {
    const res = await request(app).get(`/clientes/${clienteIdQA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(clienteIdQA);
    expect(res.body.cuit).toBe(cuitQA);
  });

  it("PUT /clientes/:id - Debería modificar el cliente QA", async () => {
    const nuevosDatos = {
      ...clienteData,
      telefono: "1199999999"
    };

    const res = await request(app).put(`/clientes/${clienteIdQA}`).send(nuevosDatos);
    expect(res.statusCode).toBe(200);
    expect(res.body.telefono).toBe("1199999999");
  });

  it("DELETE /clientes/:id - Debería eliminar el cliente QA", async () => {
    const res = await request(app).delete(`/clientes/${clienteIdQA}`);
    expect(res.statusCode).toBe(200);

    // Verificar que realmente se eliminó
    const verifyRes = await request(app).get(`/clientes/${clienteIdQA}`);
    expect(verifyRes.statusCode).toBe(404);
    
    // Ya lo borramos exitosamente, lo sacamos de la variable para que afterAll no intente borrarlo de nuevo y falle
    clienteIdQA = null;
  });
});
