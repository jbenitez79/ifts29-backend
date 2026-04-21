const fs = require("fs");
const path = require("path");
const Pedido = require("../models/Pedido");
const rutaArchivo = path.join(__dirname, "../data/pedido.json");

const leerPedidos = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
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

        const nuevoPedido = new Pedido(
            pedidos.length + 1,
            idCliente,
            productos,
            fecha || new Date().toISOString().split("T")[0]
        );

        pedidos.push(nuevoPedido);
        fs.writeFileSync(rutaArchivo, JSON.stringify(pedidos, null, 2));
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

        if (req.body.idCliente) pedido.idCliente = req.body.idCliente;
        if (req.body.productos) pedido.productos = req.body.productos;
        if (req.body.estado) pedido.estado = req.body.estado;
        if (req.body.fecha) pedido.fecha = req.body.fecha;

        pedido.total = pedido.calcularTotal();

        fs.writeFileSync(rutaArchivo, JSON.stringify(pedidos, null, 2));
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el pedido" });
    }
};

const eliminarPedido = (req, res) => {
    try {
        const pedidos = leerPedidos();
        const id = parseInt(req.params.id);
        const nuevosPedidos = pedidos.filter((p) => p.id !== id);

        if (pedidos.length === nuevosPedidos.length) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        fs.writeFileSync(rutaArchivo, JSON.stringify(nuevosPedidos, null, 2));
        res.json(nuevosPedidos);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el pedido" });
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
};