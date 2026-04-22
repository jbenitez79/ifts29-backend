const fs = require("fs");
const path = require("path");
const Pedido = require("../models/Pedido");
const rutaArchivo = path.join(__dirname, "../data/pedido.json");
const rutaProductos = path.join(__dirname, "../data/producto.json");
const rutaClientes = path.join(__dirname, "../data/cliente.json");

const leerArchivo = (ruta) => {
    try {
        const data = fs.readFileSync(ruta, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const escribirArchivo = (ruta, datos) => {
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
};

const leerPedidos = () => leerArchivo(rutaArchivo);
const leerProductos = () => leerArchivo(rutaProductos);
const leerClientes = () => leerArchivo(rutaClientes);

const obtenerNuevoId = (pedidos) => {
    if (pedidos.length === 0) return 1;
    const maxId = Math.max(...pedidos.map(p => p.id));
    return maxId + 1;
};

const validarStock = (productosPedido) => {
    const productos = leerProductos();
    const errores = [];

    for (const item of productosPedido) {
        const idProducto = parseInt(item.idProducto);
        const producto = productos.find(p => p.id == idProducto);
        if (!producto) {
            errores.push(`Producto ID ${item.idProducto} no existe`);
        } else if (producto.stock < item.cantidad) {
            errores.push(`Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock}, solicitado: ${item.cantidad})`);
        }
    }
    return errores;
};

const descontarStock = (productosPedido) => {
    const productos = leerProductos();

    for (const item of productosPedido) {
        const idProducto = parseInt(item.idProducto);
        const producto = productos.find(p => p.id == idProducto);
        if (producto) {
            producto.stock -= item.cantidad;
        }
    }
    escribirArchivo(rutaProductos, productos);
};

const restituirStock = (productosPedido) => {
    const productos = leerProductos();

    for (const item of productosPedido) {
        const idProducto = parseInt(item.idProducto);
        const producto = productos.find(p => p.id == idProducto);
        if (producto) {
            producto.stock += item.cantidad;
        }
    }
    escribirArchivo(rutaProductos, productos);
};

const obtenerPedidos = (req, res) => {
    try {
        const pedidos = leerPedidos();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los pedidos" });
    }
};

const obtenerPedidoPorId = (req, res) => {
    try {
        const pedidos = leerPedidos();
        const id = parseInt(req.params.id);
        const pedido = pedidos.find((p) => p.id === id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido" });
    }
};

const crearPedido = (req, res) => {
    try {
        const pedidos = leerPedidos();
        const { idCliente, productos, fecha } = req.body;

        if (!idCliente || !productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ message: "Datos incompletos: se requiere idCliente y productos" });
        }

        const clientes = leerClientes();
        const idClienteNum = parseInt(idCliente);
        if (!clientes.find(c => c.id == idClienteNum)) {
            return res.status(400).json({ message: `Cliente con ID ${idCliente} no existe` });
        }

        const erroresStock = validarStock(productos);
        if (erroresStock.length > 0) {
            return res.status(400).json({ message: erroresStock.join(", ") });
        }

        descontarStock(productos);

        const nuevoPedido = new Pedido(
            obtenerNuevoId(pedidos),
            idCliente,
            productos,
            fecha || new Date().toISOString().split("T")[0]
        );

        pedidos.push(nuevoPedido);
        escribirArchivo(rutaArchivo, pedidos);
        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el pedido" });
    }
};

const actualizarPedido = (req, res) => {
    try {
        const pedidos = leerPedidos();
        const id = parseInt(req.params.id);
        const pedido = pedidos.find((p) => p.id === id);

        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        if (req.body.estado && req.body.estado !== pedido.estado) {
            if (req.body.estado === "cancelado" && pedido.estado !== "cancelado") {
                restituirStock(pedido.productos);
            }
            pedido.estado = req.body.estado;
        }

        if (req.body.idCliente) pedido.idCliente = req.body.idCliente;
        if (req.body.fecha) pedido.fecha = req.body.fecha;

        if (req.body.productos) {
            restituirStock(pedido.productos);

            const erroresStock = validarStock(req.body.productos);
            if (erroresStock.length > 0) {
                descontarStock(pedido.productos);
                return res.status(400).json({ message: erroresStock.join(", ") });
            }

            pedido.productos = req.body.productos;
            descontarStock(req.body.productos);
            pedido.total = pedido.calcularTotal();
        }

        escribirArchivo(rutaArchivo, pedidos);
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el pedido" });
    }
};

const eliminarPedido = (req, res) => {
    try {
        const pedidos = leerPedidos();
        const id = parseInt(req.params.id);
        const pedido = pedidos.find((p) => p.id === id);

        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        if (pedido.estado !== "cancelado") {
            restituirStock(pedido.productos);
        }

        const nuevosPedidos = pedidos.filter((p) => p.id !== id);
        escribirArchivo(rutaArchivo, nuevosPedidos);
        res.json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el pedido" });
    }
};

const obtenerPedidosVista = (req, res) => {
    const pedidos = leerPedidos();
    res.render("pedidos/index", { pedidos });
};

const obtenerPedidoPorIdVista = (req, res) => {
    const id = parseInt(req.params.id);
    const pedidos = leerPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.render("pedidos/detail", { pedido });
};

const obtenerNuevoPedidoVista = (req, res) => {
    res.render("pedidos/nuevo");
};

const obtenerEditarPedidoVista = (req, res) => {
    const id = parseInt(req.params.id);
    const pedidos = leerPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.render("pedidos/editar", { pedido });
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidosVista,
    obtenerPedidoPorIdVista,
    obtenerNuevoPedidoVista,
    obtenerEditarPedidoVista,
};