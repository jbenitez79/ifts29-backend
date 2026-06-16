const fs = require("fs");
const path = require("path");
const Proveedor = require("../models/Proveedor");

const rutaArchivo = path.join(__dirname, "../data/proveedores.json");

// Función para leer los proveedores
const leerProveedores = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo de proveedores:", error);
        return [];
    }
};

// Obtener todos los proveedores
const obtenerProveedores = (req, res) => {
    try {
        const proveedores = leerProveedores();
        res.json(proveedores);
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        res.status(500).json({ message: "Error al obtener los proveedores" });
    }
};

// Obtener proveedor por id
const obtenerProveedorPorId = (req, res) => {
    try {
        const proveedores = leerProveedores();
        const id = parseInt(req.params.id);
        const proveedor = proveedores.find((p) => p.id === id);
        if (!proveedor) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        res.json(proveedor);
    } catch (error) {
        console.error("Error al leer el archivo de proveedores:", error);
        res.status(500).json({ message: "Error al obtener el proveedor" });
    }
};

// Crear un nuevo proveedor
const crearProveedor = (req, res) => {
    try {
        const proveedores = leerProveedores();
        const { nombre, cuit, telefono, email, domicilio, localidad, provincia, pais, rubro, condicionDePago } = req.body;

        // Generamos el nuevo id basándonos en el último existente
        const nuevoId = proveedores.length > 0 ? proveedores[proveedores.length - 1].id + 1 : 1;

        const nuevoProveedor = new Proveedor(nuevoId, nombre, cuit, telefono, email, domicilio, localidad, provincia, pais, rubro, condicionDePago);
        proveedores.push(nuevoProveedor);
        fs.writeFileSync(rutaArchivo, JSON.stringify(proveedores, null, 2));
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        console.error("Error al crear el proveedor:", error);
        res.status(500).json({ message: "Error al crear el proveedor" });
    }
};

// Actualizar un proveedor
const actualizarProveedor = (req, res) => {
    try {
        const proveedores = leerProveedores();
        const id = parseInt(req.params.id);
        const proveedor = proveedores.find((p) => p.id === id);
        if (!proveedor) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        proveedor.nombre = req.body.nombre;
        proveedor.cuit = req.body.cuit;
        proveedor.telefono = req.body.telefono;
        proveedor.email = req.body.email;
        proveedor.domicilio = req.body.domicilio;
        proveedor.localidad = req.body.localidad;
        proveedor.provincia = req.body.provincia;
        proveedor.pais = req.body.pais;
        proveedor.rubro = req.body.rubro;
        proveedor.condicionDePago = req.body.condicionDePago;
        proveedor.activo = req.body.activo;
        fs.writeFileSync(rutaArchivo, JSON.stringify(proveedores, null, 2));
        res.json(proveedor);
    } catch (error) {
        console.error("Error al actualizar el proveedor:", error);
        res.status(500).json({ message: "Error al actualizar el proveedor" });
    }
};

// Eliminar un proveedor
const eliminarProveedor = (req, res) => {
    try {
        const proveedores = leerProveedores();
        const id = parseInt(req.params.id);
        const nuevosProveedores = proveedores.filter((p) => p.id !== id);
        if (proveedores.length === nuevosProveedores.length) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        fs.writeFileSync(rutaArchivo, JSON.stringify(nuevosProveedores, null, 2));
        res.json(nuevosProveedores);
    } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
        res.status(500).json({ message: "Error al eliminar el proveedor" });
    }
};

// Vista de proveedores con Pug
const obtenerProveedorVista = (req, res) => {
    const proveedores = leerProveedores();
    res.render("proveedores/index", { proveedores });
};

// Vista detalle de un proveedor
const obtenerProveedorDetalle = (req, res) => {
    const proveedores = leerProveedores();
    const id = parseInt(req.params.id);
    const proveedor = proveedores.find((p) => p.id === id);
    if (!proveedor) {
        return res.status(404).send("Proveedor no encontrado");
    }
    res.render("proveedores/detail", { proveedor });
};

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    obtenerProveedorVista,
    obtenerProveedorDetalle
};