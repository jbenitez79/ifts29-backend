const Proveedor = require("../models/Proveedor");

const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los proveedores" });
    }
};

const obtenerProveedorPorId = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el proveedor" });
    }
};

const crearProveedor = async (req, res) => {
    try {
        const nuevoProveedor = await Proveedor.create(req.body);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el proveedor" });
    }
};

const actualizarProveedor = async (req, res) => {
    try {
        const proveedorActualizado = await Proveedor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!proveedorActualizado) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }

        res.json(proveedorActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el proveedor" });
    }
};

const eliminarProveedor = async (req, res) => {
    try {
        const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);

        if (!proveedorEliminado) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }

        res.json({ message: "Proveedor eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el proveedor" });
    }
};

const obtenerProveedorVista = async (req, res) => {
    try {
        const proveedores = await Proveedor.find().lean();
        res.render("proveedores/index", { proveedores });
    } catch (error) {
        res.status(500).send("Error al obtener los proveedores");
    }
};

const obtenerProveedorDetalle = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id).lean();
        if (!proveedor) {
            return res.status(404).send("Proveedor no encontrado");
        }
        res.render("proveedores/detalle", { proveedor });
    } catch (error) {
        res.status(500).send("Error al obtener el proveedor");
    }
};

const crearProveedorVista = (req, res) => {
    res.render("proveedores/nuevo");
};

const crearProveedorVistaPost = async (req, res) => {
    try {
        await Proveedor.create(req.body);
        res.redirect("/proveedores/vista");
    } catch (error) {
        res.status(500).send("Error al crear el proveedor");
    }
};

const actualizarProveedorVista = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id).lean();
        if (!proveedor) {
            return res.status(404).send("Proveedor no encontrado");
        }
        res.render("proveedores/editar", { proveedor });
    } catch (error) {
        res.status(500).send("Error al obtener el proveedor");
    }
};

const actualizarProveedorVistaPost = async (req, res) => {
    try {
        const proveedorActualizado = await Proveedor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!proveedorActualizado) {
            return res.status(404).send("Proveedor no encontrado");
        }

        res.redirect("/proveedores/vista");
    } catch (error) {
        res.status(500).send("Error al actualizar el proveedor");
    }
};

const eliminarProveedorVista = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id).lean();
        if (!proveedor) {
            return res.status(404).send("Proveedor no encontrado");
        }
        res.render("proveedores/eliminar", { proveedor });
    } catch (error) {
        res.status(500).send("Error al obtener el proveedor");
    }
};

const eliminarProveedorVistaPost = async (req, res) => {
    try {
        const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);

        if (!proveedorEliminado) {
            return res.status(404).send("Proveedor no encontrado");
        }

        res.redirect("/proveedores/vista");
    } catch (error) {
        res.status(500).send("Error al eliminar el proveedor");
    }
};

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    obtenerProveedorVista,
    obtenerProveedorDetalle,
    crearProveedorVista,
    crearProveedorVistaPost,
    actualizarProveedorVista,
    actualizarProveedorVistaPost,
    eliminarProveedorVista,
    eliminarProveedorVistaPost,
};
