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

const guardarPedidos = (ruta, datos) => {
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
};

const buscarClientePorCuit = (cuit) => {
    const clientes = leerClientes();
    return clientes.find(c => c.cuit === String(cuit));
};

const buscarProductoPorNombre = (nombre) => {
    const productos = leerProductos();
    const nombreLower = nombre.toLowerCase();
    return productos.find(p => p.nombre.toLowerCase().includes(nombreLower));
};

const obtenerClientePorId = (id) => {
    const clientes = leerClientes();
    return clientes.find(c => c.id === parseInt(id));
};

const obtenerProductoPorId = (id) => {
    const productos = leerProductos();
    return productos.find(p => p.id === parseInt(id));
};

const buscarPedidoPorIdInterno = (id) => {
    const pedidos = leerPedidos();
    return pedidos.find((p) => p.id === parseInt(id));
};

const enrichPedidoConDatosClienteYProducto = (pedido) => {
    if (!pedido) return null;
    const cliente = obtenerClientePorId(pedido.idCliente);
    const productosEnriquecidos = pedido.productos.map(p => {
        const producto = obtenerProductoPorId(p.idProducto);
        return {
            ...p,
            descripcion: producto ? producto.descripcion : 'Sin descripción',
            nombreProducto: producto ? producto.nombre : 'Producto desconocido',
            subtotal: parseInt(p.cantidad) * parseFloat(p.precio)
        };
    });
    return {
        ...pedido,
        cliente,
        productos: productosEnriquecidos
    };
};

const enrichListaPedidos = (pedidos) => {
    return pedidos.map(pedido => {
        const cliente = obtenerClientePorId(pedido.idCliente);
        return {
            ...pedido,
            nombreCliente: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente desconocido',
            cuitCliente: cliente ? cliente.cuit : '',
            cantidadProductos: pedido.productos.length
        };
    });
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
        const cantidad = parseInt(item.cantidad);
        const producto = productos.find(p => p.id == idProducto);
        if (!producto) {
            errores.push(`Producto ID ${item.idProducto} no existe`);
        } else if (parseInt(producto.stock) < cantidad) {
            errores.push(`Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock}, solicitado: ${item.cantidad})`);
        }
    }
    return errores;
};

const descontarStock = (productosPedido) => {
    const productos = leerProductos();

    for (const item of productosPedido) {
        const idProducto = parseInt(item.idProducto);
        const cantidad = parseInt(item.cantidad);
        const producto = productos.find(p => p.id == idProducto);
        if (producto) {
            producto.stock = parseInt(producto.stock) - cantidad;
        }
    }
    guardarPedidos(rutaProductos, productos);
};

const restituirStock = (productosPedido) => {
    const productos = leerProductos();

    for (const item of productosPedido) {
        const idProducto = parseInt(item.idProducto);
        const cantidad = parseInt(item.cantidad);
        const producto = productos.find(p => p.id == idProducto);
        if (producto) {
            producto.stock = parseInt(producto.stock) + cantidad;
        }
    }
    guardarPedidos(rutaProductos, productos);
};

const obtenerPedidos = (req, res) => {
    try {
        const pedidos = leerPedidos();
        const pedidosEnriquecidos = enrichListaPedidos(pedidos);
        res.json(pedidosEnriquecidos);
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
        const pedidoEnriquecido = enrichPedidoConDatosClienteYProducto(pedido);
        res.json(pedidoEnriquecido);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido" });
    }
};

const crearPedido = (req, res) => {
    try {
        const pedidos = leerPedidos();
        const { idCliente, productos, fecha } = req.body;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ message: "Datos incompletos: se requiere idCliente y productos" });
        }

        let cliente;
        if (req.body.cuit) {
            cliente = buscarClientePorCuit(req.body.cuit);
            if (!cliente) {
                return res.status(400).json({ message: `Cliente con CUIT ${req.body.cuit} no encontrado` });
            }
        } else if (idCliente) {
            cliente = obtenerClientePorId(idCliente);
            if (!cliente) {
                return res.status(400).json({ message: `Cliente con ID ${idCliente} no existe` });
            }
        } else {
            return res.status(400).json({ message: "Se requiere CUIT o ID del cliente" });
        }

        const erroresStock = validarStock(productos);
        if (erroresStock.length > 0) {
            return res.status(400).json({ message: erroresStock.join(", ") });
        }

        descontarStock(productos);

        const nuevoPedido = {
            id: obtenerNuevoId(pedidos),
            idCliente: cliente.id,
            productos: productos,
            fecha: fecha || new Date().toISOString().split("T")[0],
            estado: "pendiente",
            total: productos.reduce((sum, prod) => {
                return sum + (parseInt(prod.cantidad) * parseFloat(prod.precio));
            }, 0)
        };

        pedidos.push(nuevoPedido);
        guardarPedidos(rutaArchivo, pedidos);
        if (req.xhr || req.headers.accept?.includes("json")) {
            res.status(201).json(nuevoPedido);
        } else {
            res.redirect("/pedidos/vista");
        }
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
            const productosAnteriores = pedido.productos.map(p => ({ idProducto: parseInt(p.idProducto), cantidad: parseInt(p.cantidad), precio: parseFloat(p.precio) }));
            const productosNuevos = req.body.productos.map(p => ({ idProducto: parseInt(p.idProducto), cantidad: parseInt(p.cantidad), precio: parseFloat(p.precio) }));
            const productosCambiaron = JSON.stringify(productosAnteriores) !== JSON.stringify(productosNuevos);

            if (productosCambiaron) {
                restituirStock(pedido.productos);

                const erroresStock = validarStock(req.body.productos);
                if (erroresStock.length > 0) {
                    descontarStock(pedido.productos);
                    return res.status(400).json({ message: erroresStock.join(", ") });
                }

                pedido.productos = req.body.productos;
                descontarStock(req.body.productos);
                const productosCalc = req.body.productos;
                pedido.total = productosCalc.reduce((sum, prod) => {
                    return sum + (parseInt(prod.cantidad) * parseFloat(prod.precio));
                }, 0);
            } else {
                pedido.productos = req.body.productos;
            }
        }

        guardarPedidos(rutaArchivo, pedidos);
        if (req.xhr || req.headers.accept?.includes("json")) {
            res.json(pedido);
        } else {
            res.redirect("/pedidos/vista");
        }
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
        guardarPedidos(rutaArchivo, nuevosPedidos);
        if (req.xhr || req.headers.accept?.includes("json")) {
            res.json({ message: "Pedido eliminado correctamente" });
        } else {
            res.redirect("/pedidos/vista");
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el pedido" });
    }
};

const obtenerPedidosVista = (req, res) => {
    const pedidos = leerPedidos();
    const pedidosEnriquecidos = enrichListaPedidos(pedidos);
    res.render("pedidos/index", { pedidos: pedidosEnriquecidos });
};

const obtenerPedidoPorIdVista = (req, res) => {
    const id = parseInt(req.params.id);
    const pedidos = leerPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    const pedidoEnriquecido = enrichPedidoConDatosClienteYProducto(pedido);
    res.render("pedidos/detalle", { pedido: pedidoEnriquecido });
};

const crearPedidoVista = (req, res) => {
    const clientes = leerClientes();
    const productos = leerProductos();
    res.render("pedidos/nuevo", { clientes, productos });
};

const actualizarPedidoVista = (req, res) => {
    const id = parseInt(req.params.id);
    const pedidos = leerPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.render("pedidos/editar", { pedido });
};

const eliminarPedidoVista = (req, res) => {
    const pedido = buscarPedidoPorIdInterno(req.params.id);
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.render("pedidos/eliminar", { pedido });
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
    actualizarPedidoVista,
    eliminarPedidoVista,
};