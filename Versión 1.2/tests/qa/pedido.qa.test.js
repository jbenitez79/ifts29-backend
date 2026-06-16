const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Pedido = require("../../models/Pedido");
const Cliente = require("../../models/Cliente");
const Producto = require("../../models/Producto");

describe("QA E2E - Modelo Pedido (/pedidos)", () => {
  let pedidoIdQA;
  let clienteId;
  let productoId;
  
  const cuitQA = "QA-777777777-7";
  const nombreProductoQA = "Producto Pedido QA";

  beforeAll(async () => {
    // 1. Crear dependencias: Cliente QA
    await Cliente.findOneAndDelete({ cuit: cuitQA });
    const cliente = await Cliente.create({
      nombre: "Cliente Pedido QA",
      apellido: "Test",
      email: "pedido_qa@test.com",
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

    // 2. Crear dependencias: Producto QA
    await Producto.findOneAndDelete({ nombre: nombreProductoQA });
    const producto = await Producto.create({
      nombre: nombreProductoQA,
      precio: 100,
      stock: 10
    });
    productoId = producto._id;
  });

  afterAll(async () => {
    // Limpiar Pedido QA
    if (pedidoIdQA) {
      await Pedido.findByIdAndDelete(pedidoIdQA);
    }
    // Limpiar dependencias
    await Cliente.findByIdAndDelete(clienteId);
    await Producto.findByIdAndDelete(productoId);
    
    await mongoose.connection.close();
  });

  it("POST /pedidos - Debería crear un pedido QA", async () => {
    const pedidoData = {
      cliente: clienteId,
      productos: [{
        producto: productoId,
        cantidad: 2,
        precio: 100
      }],
      estado: "pendiente",
      total: 200
    };

    const res = await request(app).post("/pedidos").send(pedidoData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.estado).toBe("pendiente");
    expect(res.body.total).toBe(200);
    
    pedidoIdQA = res.body._id;
  });

  it("GET /pedidos - Debería listar el pedido QA creado", async () => {
    const res = await request(app).get("/pedidos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    // Verificar si existe el pedido creado
    const encontrado = res.body.find(p => p._id.toString() === pedidoIdQA.toString());
    expect(encontrado).toBeDefined();
  });

  it("GET /pedidos/:id - Debería traer el detalle del pedido QA", async () => {
    const res = await request(app).get(`/pedidos/${pedidoIdQA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(pedidoIdQA.toString());
  });

  it("PUT /pedidos/:id - Debería modificar el pedido QA", async () => {
    const nuevosDatos = {
      estado: "aprobado",
      total: 200 // requerimos enviar los datos obligatorios según el controlador o mongoose si usamos runValidators
    };

    const res = await request(app).put(`/pedidos/${pedidoIdQA}`).send(nuevosDatos);
    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe("aprobado");
  });

  it("DELETE /pedidos/:id - Debería eliminar el pedido QA", async () => {
    const res = await request(app).delete(`/pedidos/${pedidoIdQA}`);
    expect(res.statusCode).toBe(200);

    const verifyRes = await request(app).get(`/pedidos/${pedidoIdQA}`);
    expect(verifyRes.statusCode).toBe(404);
    
    pedidoIdQA = null;
  });
});
