const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Producto = require("../../models/Producto");

describe("QA E2E - Modelo Producto (/productos)", () => {
  let productoIdQA;
  const nombreQA = "Producto de Prueba QA";
  
  const productoData = {
    nombre: nombreQA,
    descripcion: "Descripción generada para QA",
    precio: 9999,
    stock: 50,
    stock_minimo: 10
  };

  afterAll(async () => {
    // Limpieza estricta: borrar SOLO el producto QA
    if (productoIdQA) {
      await Producto.findByIdAndDelete(productoIdQA);
    } else {
      await Producto.findOneAndDelete({ nombre: nombreQA });
    }
    await mongoose.connection.close();
  });

  it("POST /productos - Debería crear un producto QA", async () => {
    await Producto.findOneAndDelete({ nombre: nombreQA });

    const res = await request(app).post("/productos").send(productoData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nombre).toBe(productoData.nombre);
    
    productoIdQA = res.body._id;
  });

  it("GET /productos - Debería listar el producto QA creado", async () => {
    const res = await request(app).get("/productos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    const encontrado = res.body.find(p => p.nombre === nombreQA);
    expect(encontrado).toBeDefined();
    expect(encontrado._id).toBe(productoIdQA);
  });

  it("GET /productos/:id - Debería traer el detalle del producto QA", async () => {
    const res = await request(app).get(`/productos/${productoIdQA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(productoIdQA);
  });

  it("PUT /productos/:id - Debería modificar el producto QA", async () => {
    const nuevosDatos = {
      ...productoData,
      precio: 8888,
      stock: 60
    };

    const res = await request(app).put(`/productos/${productoIdQA}`).send(nuevosDatos);
    expect(res.statusCode).toBe(200);
    expect(res.body.precio).toBe(8888);
    expect(res.body.stock).toBe(60);
  });

  it("DELETE /productos/:id - Debería eliminar el producto QA", async () => {
    const res = await request(app).delete(`/productos/${productoIdQA}`);
    expect(res.statusCode).toBe(200);

    const verifyRes = await request(app).get(`/productos/${productoIdQA}`);
    expect(verifyRes.statusCode).toBe(404);
    
    productoIdQA = null;
  });
});
