const fs = require("fs");
const path = require("path");
const Cliente = require("../models/Cliente");
const rutaArchivo = path.join(__dirname, "../data/cliente.json");

// ==========================================
// 1. LÓGICA INTERNA DE NEGOCIO (Capa de Servicios)
// ==========================================
const leerClientes = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo de clientes:", error);
        return [];
    }
};

const guardarClientes = (clientes) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(clientes, null, 2));
};

const buscarClientePorIdInterno = (id) => {
    const clientes = leerClientes();
    return clientes.find((c) => c.id === parseInt(id));
};

// ==========================================
// 2. CONTROLADORES JSON (Endpoints de la API)
// ==========================================
const obtenerClientes = (req, res) => {
    try {
        res.json(leerClientes());
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};

const obtenerClientePorId = (req, res) => {
    try {
        const cliente = buscarClientePorIdInterno(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        console.error("Error al leer el archivo de clientes:", error);
        res.status(500).json({ message: "Error al obtener el cliente" });
    }
};

const crearCliente = (req, res) => {
    try {
        const clientes = leerClientes();
        const { nombre, apellido, email, telefono, cuit, domicilio, localidad, provincia, pais, codigoPostal, fechaNacimiento } = req.body;
        const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
        const nuevoCliente = new Cliente(nuevoId, nombre, apellido, email, telefono, cuit, domicilio, localidad, provincia, pais, codigoPostal, fechaNacimiento);
        
        clientes.push(nuevoCliente);
        guardarClientes(clientes);
        
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        res.status(500).json({ message: "Error al crear el cliente" });
    }
};

const actualizarCliente = (req, res) => {
    try {
        const clientes = leerClientes();
        const id = parseInt(req.params.id);
        const index = clientes.findIndex((c) => c.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        // Actualizar datos
        clientes[index] = { ...clientes[index], ...req.body };
        guardarClientes(clientes);
        
        res.json(clientes[index]);
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).json({ message: "Error al actualizar el cliente" });
    }
};

const eliminarCliente = (req, res) => {
    try {
        const clientes = leerClientes();
        const id = parseInt(req.params.id);
        const nuevosClientes = clientes.filter((c) => c.id !== id);
        
        if (clientes.length === nuevosClientes.length) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        
        guardarClientes(nuevosClientes);
        res.json({ message: "Cliente eliminado", clientes: nuevosClientes });
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ message: "Error al eliminar el cliente" });
    }
};

// ==========================================
// 3. CONTROLADORES DE VISTAS PUG (Renderizado HTML)
// ==========================================
const obtenerClienteVista = (req, res) => {
    const clientes = leerClientes();
    res.render("clientes/index", { clientes });
};

const crearClienteVista = (req, res) => {
    res.render("clientes/nuevo");
};

const obtenerClienteVistaPorId = (req, res) => {
    const cliente = buscarClientePorIdInterno(req.params.id);
    if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.render("clientes/detalle", { cliente });
};

const actualizarClienteVista = (req, res) => {
    const cliente = buscarClientePorIdInterno(req.params.id);
    if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.render("clientes/editar", { cliente });
};

const eliminarClienteVista = (req, res) => {
    const cliente = buscarClientePorIdInterno(req.params.id);
    if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.render("clientes/eliminar", { cliente });
};

module.exports = {
    // API JSON
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    // VISTAS
    obtenerClienteVista,
    crearClienteVista,
    obtenerClienteVistaPorId,
    actualizarClienteVista,
    eliminarClienteVista
};
