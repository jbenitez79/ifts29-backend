const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");

const validarStock = async (productos) => {
    const errores = [];
    for (const item of productos) {
        const producto = await Producto.findById(item.producto);
        if (!producto) {
            errores.push(`Producto ${item.producto} no existe`);
        } else if (producto.stock < item.cantidad) {
            errores.push(`Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock}, solicitado: ${item.cantidad})`);
        }
    }
    return errores;
};

const descontarStock = async (productos) => {
    for (const item of productos) {
        await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
    }
};

const restituirStock = async (productos) => {
    for (const item of productos) {
        await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: item.cantidad } });
    }
};

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate("cliente")
            .populate("productos.producto");
        res.json(pedidos);
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        res.status(500).json({ message: "Error al obtener los pedidos" });
    }
};

const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id)
            .populate("cliente")
            .populate("productos.producto");
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.json(pedido);
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        res.status(500).json({ message: "Error al obtener el pedido" });
    }
};

const crearPedido = async (req, res) => {
    try {
        const { cliente, productos, fecha } = req.body;

        if (!cliente || !productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ message: "Datos incompletos: se requiere cliente y productos" });
        }

        const erroresStock = await validarStock(productos);
        if (erroresStock.length > 0) {
            return res.status(400).json({ message: erroresStock.join(", ") });
        }

        const total = productos.reduce((sum, p) => sum + (parseInt(p.cantidad) * parseFloat(p.precio)), 0);

        const nuevoPedido = await Pedido.create({
            cliente,
            productos: productos.map(p => ({
                producto: p.producto,
                cantidad: parseInt(p.cantidad),
                precio: parseFloat(p.precio),
            })),
            fecha: fecha || new Date(),
            total,
        });

        await descontarStock(productos);

        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        res.status(500).json({ message: "Error al crear el pedido" });
    }
};

const actualizarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        if (req.body.estado && req.body.estado !== pedido.estado) {
            if (req.body.estado === "cancelado" && pedido.estado !== "cancelado") {
                await restituirStock(pedido.productos);
            }
            pedido.estado = req.body.estado;
        }

        if (req.body.cliente) pedido.cliente = req.body.cliente;
        if (req.body.fecha) pedido.fecha = req.body.fecha;

        if (req.body.productos) {
            await restituirStock(pedido.productos);

            const erroresStock = await validarStock(req.body.productos);
            if (erroresStock.length > 0) {
                await descontarStock(pedido.productos);
                return res.status(400).json({ message: erroresStock.join(", ") });
            }

            pedido.productos = req.body.productos.map(p => ({
                producto: p.producto,
                cantidad: parseInt(p.cantidad),
                precio: parseFloat(p.precio),
            }));

            pedido.total = pedido.productos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);

            await descontarStock(req.body.productos);
        }

        await pedido.save();

        res.json(pedido);
    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
        res.status(500).json({ message: "Error al actualizar el pedido" });
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        if (pedido.estado !== "cancelado") {
            await restituirStock(pedido.productos);
        }

        await Pedido.findByIdAndDelete(req.params.id);

        res.json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el pedido:", error);
        res.status(500).json({ message: "Error al eliminar el pedido" });
    }
};

const normalizeFecha = (p) => {
    if (p.fecha && typeof p.fecha === "string") p.fecha = new Date(p.fecha);
    return p;
};

const obtenerPedidosVista = async (req, res) => {
    try {
        let pedidos = await Pedido.find()
            .populate("cliente")
            .populate("productos.producto")
            .lean();
        pedidos = pedidos.map(normalizeFecha);
        res.render("pedidos/index", { pedidos });
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        res.status(500).send("Error al obtener los pedidos");
    }
};

const obtenerPedidoPorIdVista = async (req, res) => {
    try {
        let pedido = await Pedido.findById(req.params.id)
            .populate("cliente")
            .populate("productos.producto")
            .lean();
        if (!pedido) {
            return res.status(404).send("Pedido no encontrado");
        }
        pedido = normalizeFecha(pedido);
        res.render("pedidos/detalle", { pedido });
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        res.status(500).send("Error al obtener el pedido");
    }
};

const crearPedidoVista = async (req, res) => {
    try {
        const clientes = await Cliente.find().lean();
        const productos = await Producto.find().lean();
        res.render("pedidos/nuevo", { clientes, productos });
    } catch (error) {
        console.error("Error al cargar el formulario:", error);
        res.status(500).send("Error al cargar el formulario");
    }
};

const crearPedidoVistaPost = async (req, res) => {
    try {
        let clienteId = req.body.idCliente;
        if (!clienteId && req.body.cuit) {
            const cliente = await Cliente.findOne({ cuit: req.body.cuit });
            if (!cliente) {
                return res.status(400).send("Cliente no encontrado");
            }
            clienteId = cliente._id;
        }

        if (!clienteId) {
            return res.status(400).send("Datos incompletos: se requiere cliente");
        }

        const productos = Array.isArray(req.body.productos)
            ? req.body.productos
            : [req.body.productos];

        const pedidoProductos = productos.map(p => ({
            producto: p.idProducto,
            cantidad: parseInt(p.cantidad),
            precio: parseFloat(p.precio),
        }));

        const erroresStock = await validarStock(pedidoProductos);
        if (erroresStock.length > 0) {
            return res.status(400).send(erroresStock.join(", "));
        }

        const total = pedidoProductos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);

        await Pedido.create({
            cliente: clienteId,
            productos: pedidoProductos,
            fecha: req.body.fecha || new Date(),
            total,
        });

        await descontarStock(pedidoProductos);

        res.redirect("/pedidos/vista");
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        res.status(500).send("Error al crear el pedido");
    }
};

const actualizarPedidoVista = async (req, res) => {
    try {
        let pedido = await Pedido.findById(req.params.id)
            .populate("cliente")
            .populate("productos.producto")
            .lean();
        if (!pedido) {
            return res.status(404).send("Pedido no encontrado");
        }
        pedido = normalizeFecha(pedido);
        res.render("pedidos/editar", { pedido });
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        res.status(500).send("Error al obtener el pedido");
    }
};

const actualizarPedidoVistaPost = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).send("Pedido no encontrado");
        }

        if (req.body.estado && req.body.estado !== pedido.estado) {
            if (req.body.estado === "cancelado" && pedido.estado !== "cancelado") {
                await restituirStock(pedido.productos);
            }
            pedido.estado = req.body.estado;
        }

        if (req.body.idCliente) pedido.cliente = req.body.idCliente;
        if (req.body.fecha) pedido.fecha = req.body.fecha;

        if (req.body.productos) {
            await restituirStock(pedido.productos);

            const productosArray = Array.isArray(req.body.productos)
                ? req.body.productos
                : [req.body.productos];

            const nuevosProductos = productosArray.map(p => ({
                producto: p.idProducto,
                cantidad: parseInt(p.cantidad),
                precio: parseFloat(p.precio),
            }));

            const erroresStock = await validarStock(nuevosProductos);
            if (erroresStock.length > 0) {
                await descontarStock(pedido.productos);
                return res.status(400).send(erroresStock.join(", "));
            }

            pedido.productos = nuevosProductos;
            pedido.total = nuevosProductos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);

            await descontarStock(nuevosProductos);
        }

        await pedido.save();

        res.redirect("/pedidos/vista");
    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
        res.status(500).send("Error al actualizar el pedido");
    }
};

const eliminarPedidoVista = async (req, res) => {
    try {
        let pedido = await Pedido.findById(req.params.id)
            .populate("cliente")
            .populate("productos.producto")
            .lean();
        if (!pedido) {
            return res.status(404).send("Pedido no encontrado");
        }
        pedido = normalizeFecha(pedido);
        res.render("pedidos/eliminar", { pedido });
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        res.status(500).send("Error al obtener el pedido");
    }
};

const eliminarPedidoVistaPost = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).send("Pedido no encontrado");
        }

        if (pedido.estado !== "cancelado") {
            await restituirStock(pedido.productos);
        }

        await Pedido.findByIdAndDelete(req.params.id);

        res.redirect("/pedidos/vista");
    } catch (error) {
        console.error("Error al eliminar el pedido:", error);
        res.status(500).send("Error al eliminar el pedido");
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidosVista,
    obtenerPedidoPorIdVista,
    crearPedidoVista,
    crearPedidoVistaPost,
    actualizarPedidoVista,
    actualizarPedidoVistaPost,
    eliminarPedidoVista,
    eliminarPedidoVistaPost,
};
