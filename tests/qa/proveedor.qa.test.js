const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Proveedor = require("../../models/Proveedor");

describe("QA E2E - Modelo Proveedor (/proveedores)", () => {
  let proveedorIdQA;
  const cuitQA = "QA-888888888-8";
  
  const proveedorData = {
    nombre: "QA Proveedor SA",
    cuit: cuitQA,
    telefono: "2200000000",
    email: "qa_proveedor@test.com",
    domicilio: "Av QA 456",
    localidad: "Ciudad QA",
    provincia: "Provincia QA",
    pais: "País QA",
    rubro: "Limpieza QA",
    condicionDePago: "30 dias"
  };

  afterAll(async () => {
    // Limpieza estricta: borrar SOLO el proveedor QA
    if (proveedorIdQA) {
      await Proveedor.findByIdAndDelete(proveedorIdQA);
    } else {
      await Proveedor.findOneAndDelete({ cuit: cuitQA });
    }
    await mongoose.connection.close();
  });

  it("POST /proveedores - Debería crear un proveedor QA", async () => {
    // Limpiar restos previos
    await Proveedor.findOneAndDelete({ cuit: cuitQA });

    const res = await request(app).post("/proveedores").send(proveedorData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nombre).toBe(proveedorData.nombre);
    
    proveedorIdQA = res.body._id;
  });

  it("GET /proveedores - Debería listar el proveedor QA creado", async () => {
    const res = await request(app).get("/proveedores");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    const encontrado = res.body.find(p => p.cuit === cuitQA);
    expect(encontrado).toBeDefined();
    expect(encontrado._id).toBe(proveedorIdQA);
  });

  it("GET /proveedores/:id - Debería traer el detalle del proveedor QA", async () => {
    const res = await request(app).get(`/proveedores/${proveedorIdQA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(proveedorIdQA);
  });

  it("PUT /proveedores/:id - Debería modificar el proveedor QA", async () => {
    const nuevosDatos = {
      ...proveedorData,
      condicionDePago: "Contado"
    };

    const res = await request(app).put(`/proveedores/${proveedorIdQA}`).send(nuevosDatos);
    expect(res.statusCode).toBe(200);
    expect(res.body.condicionDePago).toBe("Contado");
  });

  it("DELETE /proveedores/:id - Debería eliminar el proveedor QA", async () => {
    const res = await request(app).delete(`/proveedores/${proveedorIdQA}`);
    expect(res.statusCode).toBe(200);

    const verifyRes = await request(app).get(`/proveedores/${proveedorIdQA}`);
    expect(verifyRes.statusCode).toBe(404);
    
    proveedorIdQA = null;
  });
});
