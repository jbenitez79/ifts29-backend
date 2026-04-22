const fs = require("fs");
const path = require("path");
const Producto = require("../models/Productos");
const rutaArchivo = path.join(__dirname, "../data/producto.json");

// Función auxiliar para leer los productos
const leerProductos = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error);
        return [];
    }
};

// Obtener todos los productos
const obtenerProductos = (req, res) => {
    try {
        const productos = leerProductos();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

// Obtener un producto por ID
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
        console.error("Error al leer el archivo de productos:", error);
        res.status(500).json({ message: "Error al obtener el producto" });
    }
};

// Crear un nuevo producto
const crearProducto = (req, res) => {
    try {
        const productos = leerProductos();
        const { id, nombre, descripcion, precio, stock, stock_minimo } = req.body;
        const nuevoProducto = new Producto(id, nombre, descripcion, precio, stock, stock_minimo);
        productos.push(nuevoProducto);
        fs.writeFileSync(rutaArchivo, JSON.stringify(productos, null, 2));
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
};

// Actualizar un producto
const actualizarProducto = (req, res) => {
    try {
        const productos = leerProductos();
        const id = parseInt(req.params.id);
        const producto = productos.find((p) => p.id === id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        producto.nombre = req.body.nombre;
        producto.descripcion = req.body.descripcion;
        producto.precio = req.body.precio;
        producto.stock = req.body.stock;
        producto.stock_minimo = req.body.stock_minimo;
        fs.writeFileSync(rutaArchivo, JSON.stringify(productos, null, 2));
        res.json(producto);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};


// Eliminar un producto
const eliminarProducto = (req, res) => {
    try {
        const productos = leerProductos();
        const id = parseInt(req.params.id);
        const nuevosProductos = productos.filter((p) => p.id !== id);
        if (productos.length === nuevosProductos.length) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        fs.writeFileSync(rutaArchivo, JSON.stringify(nuevosProductos, null, 2));
        res.json(nuevosProductos);
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
};
const obtenerProductoVista = (req, res) => {
    const productos = leerProductos();
    res.render("productos", { productos });
};
module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoVista,
};
