const Producto = require("../models/Productos");

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto" });
    }
};

const buscarProductoPorNombre = async (req, res) => {
    try {
        const nombre = req.params.nombre;
        const producto = await Producto.findOne({
            nombre: { $regex: nombre, $options: "i" },
        });
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar producto" });
    }
};

const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto" });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
};

const obtenerProductosVista = async (req, res) => {
    try {
        const productos = await Producto.find().lean();
        res.render("productos/index", { productos });
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
};

const obtenerProductoPorIdVista = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).lean();
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render("productos/detalle", { producto });
    } catch (error) {
        res.status(500).send("Error al obtener el producto");
    }
};

const crearProductoVista = (req, res) => {
    res.render("productos/nuevo");
};

const crearProductoVistaPost = async (req, res) => {
    try {
        await Producto.create(req.body);
        res.redirect("/productos/vista");
    } catch (error) {
        res.status(500).send("Error al crear el producto");
    }
};

const editarProductoVista = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).lean();
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render("productos/editar", { producto });
    } catch (error) {
        res.status(500).send("Error al obtener el producto");
    }
};

const actualizarProductoVistaPost = async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!productoActualizado) {
            return res.status(404).send("Producto no encontrado");
        }

        res.redirect("/productos/vista");
    } catch (error) {
        res.status(500).send("Error al actualizar el producto");
    }
};

const eliminarProductoVista = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).lean();
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render("productos/eliminar", { producto });
    } catch (error) {
        res.status(500).send("Error al obtener el producto");
    }
};

const eliminarProductoVistaPost = async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

        if (!productoEliminado) {
            return res.status(404).send("Producto no encontrado");
        }

        res.redirect("/productos/vista");
    } catch (error) {
        res.status(500).send("Error al eliminar el producto");
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductoPorNombre,
    obtenerProductosVista,
    obtenerProductoPorIdVista,
    crearProductoVista,
    crearProductoVistaPost,
    editarProductoVista,
    actualizarProductoVistaPost,
    eliminarProductoVista,
    eliminarProductoVistaPost,
};
