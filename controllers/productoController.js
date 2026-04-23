const fs = require("fs");
const path = require("path");
const rutaArchivo = path.join(__dirname, "../data/producto.json");

const leerProductos = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const guardarProductos = (productos) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(productos, null, 2));
};

const obtenerProductos = (req, res) => {
    try {
        const productos = leerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

const obtenerProductoPorId = (req, res) => {
    try {
        const productos = leerProductos();
        const id = parseInt(req.params.id);
        const producto = productos.find((p) => p.id === id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto" });
    }
};

const crearProducto = (req, res) => {
    try {
        const productos = leerProductos();
        const { id, nombre, descripcion, precio, stock, stock_minimo } = req.body;

        if (!nombre || !precio) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        const nuevoProducto = {
            id: parseInt(id) || Math.max(...productos.map(p => p.id), 0) + 1,
            nombre,
            descripcion: descripcion || "",
            precio: parseFloat(precio),
            stock: parseInt(stock) || 0,
            stock_minimo: parseInt(stock_minimo) || 0
        };

        productos.push(nuevoProducto);
        guardarProductos(productos);

        if (req.xhr || req.headers.accept?.includes("json")) {
            res.status(201).json(nuevoProducto);
        } else {
            res.redirect("/productos/vista");
        }
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto" });
    }
};

const actualizarProducto = (req, res) => {
    try {
        const productos = leerProductos();
        const id = parseInt(req.params.id);
        const producto = productos.find((p) => p.id === id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (req.body.nombre) producto.nombre = req.body.nombre;
        if (req.body.descripcion) producto.descripcion = req.body.descripcion;
        if (req.body.precio) producto.precio = parseFloat(req.body.precio);
        if (req.body.stock) producto.stock = parseInt(req.body.stock);
        if (req.body.stock_minimo) producto.stock_minimo = parseInt(req.body.stock_minimo);

        guardarProductos(productos);

        if (req.xhr || req.headers.accept?.includes("json")) {
            res.json(producto);
        } else {
            res.redirect("/productos/vista");
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};

const eliminarProducto = (req, res) => {
    try {
        const productos = leerProductos();
        const id = parseInt(req.params.id);
        const producto = productos.find((p) => p.id === id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const nuevosProductos = productos.filter((p) => p.id !== id);
        guardarProductos(nuevosProductos);

        if (req.xhr || req.headers.accept?.includes("json")) {
            res.json({ message: "Producto eliminado correctamente" });
        } else {
            res.redirect("/productos/vista");
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
};

const obtenerProductosVista = (req, res) => {
    const productos = leerProductos();
    res.render("productos/index", { productos });
};

const obtenerProductoPorIdVista = (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.render("productos/detail", { producto });
};

const crearProductoVista = (req, res) => {
    res.render("productos/nuevo");
};

const editarProductoVista = (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.render("productos/editar", { producto });
};

const eliminarProductoVista = (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.render("productos/eliminar", { producto });
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosVista,
    obtenerProductoPorIdVista,
    crearProductoVista,
    editarProductoVista,
    eliminarProductoVista,
};