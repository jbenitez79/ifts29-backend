const fs = require("fs");
const path = require("path");
const Cliente = require("../models/Cliente");
const rutaArchivo = path.join(__dirname, "../data/cliente.json");

// Función auxiliar para leer los clientes
const leerClientes = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo de clientes:", error);
        return [];
    }
};

// Obtener todos los clientes
const obtenerClientes = (req, res) => {
    try {
        const clientes = leerClientes();
        res.json(clientes);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};

// Obtener un cliente por ID
const obtenerClientePorId = (req, res) => {
    try {
        const clientes = leerClientes();
        const id = parseInt(req.params.id)
        const cliente = clientes.find((c) => c.id === id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        console.error("Error al leer el archivo de clientes:", error);
        res.status(500).json({ message: "Error al obtener el cliente" });
    }
};

// Crear un nuevo cliente
const crearCliente = (req, res) => {
    try {
        const clientes = leerClientes();
        const { nombre, apellido, email, telefono, cuit, domicilio, localidad, provincia, pais, codigoPostal, fechaNacimiento } = req.body;
        const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
        const nuevoCliente = new Cliente(nuevoId, nombre, apellido, email, telefono, cuit, domicilio, localidad, provincia, pais, codigoPostal, fechaNacimiento);
        clientes.push(nuevoCliente);
        fs.writeFileSync(rutaArchivo, JSON.stringify(clientes, null, 2));
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        res.status(500).json({ message: "Error al crear el cliente" });
    }
};

// Actualizar un cliente
const actualizarCliente = (req, res) => {
    try {
        const clientes = leerClientes();
        const id = parseInt(req.params.id)
        const cliente = clientes.find((c) => c.id === id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        cliente.nombre = req.body.nombre;
        cliente.apellido = req.body.apellido;
        cliente.email = req.body.email;
        cliente.telefono = req.body.telefono;
        cliente.cuit = req.body.cuit;
        cliente.domicilio = req.body.domicilio;
        cliente.localidad = req.body.localidad;
        cliente.provincia = req.body.provincia;
        cliente.pais = req.body.pais;
        cliente.codigoPostal = req.body.codigoPostal;
        cliente.fechaNacimiento = req.body.fechaNacimiento;
        fs.writeFileSync(rutaArchivo, JSON.stringify(clientes, null, 2));
        res.json(cliente);
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).json({ message: "Error al actualizar el cliente" });
    }
};

// Eliminar un cliente
const eliminarCliente = (req, res) => {
    try {
        const clientes = leerClientes();
        const id = parseInt(req.params.id)
        const nuevosClientes = clientes.filter((c) => c.id !== id);
        if (clientes.length === nuevosClientes.length) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        fs.writeFileSync(rutaArchivo, JSON.stringify(nuevosClientes, null, 2));
        res.json(nuevosClientes);
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ message: "Error al eliminar el cliente" });
    }
};
const obtenerClienteVista = (req, res) => {
    const clientes = leerClientes();
    res.render("index", { clientes });
};
module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerClienteVista,
};
