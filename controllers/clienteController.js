const Cliente = require("../models/Cliente");

// ==========================================
// 2. CONTROLADORES JSON (Endpoints de la API)
// ==========================================
const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};

const obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        res.status(500).json({ message: "Error al obtener el cliente" });
    }
};

const buscarClientePorCuit = async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ cuit: req.params.cuit });
        
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        console.error("Error al buscar cliente por CUIT:", error);
        res.status(500).json({ message: error.message || "Error al buscar cliente por CUIT" });
    }
};

const crearCliente = async(req, res) => {
    try {
        const nuevoCliente = await Cliente.create(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        res.status(500).json({ message: "Error al crear el cliente" });
    }
};

const actualizarCliente = async (req, res) => {
    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        
        if (!clienteActualizado) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.json(clienteActualizado);
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).json({ message: error.message || "Error al actualizar el cliente" });
    }
};

const eliminarCliente = async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        
        if (!clienteEliminado) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        
        res.json({ message: "Cliente eliminado" });
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ message: error.message || "Error al eliminar el cliente" });
    }
};

// ==========================================
// 3. CONTROLADORES DE VISTAS PUG (Renderizado HTML)
// ==========================================
const obtenerClienteVista = async (req, res) => {
    try {
        const clientes = await Cliente.find().lean();
        res.render("clientes/index", { clientes });
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).send( "Error al obtener los clientes" );
    }
};

const crearClienteVista = (req, res) => {
        res.render("clientes/nuevo");
    };

const crearClienteVistaPost = async (req, res) => {
    try {
       await Cliente.create(req.body);
        res.redirect("/clientes/vista");
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        res.status(500).send( "Error al crear el cliente" );
    }
};

const obtenerClienteVistaPorId = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id).lean();
        if (!cliente) {
            return res.status(404).send( "Cliente no encontrado" );
        }
        res.render("clientes/detalle", { cliente });
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        res.status(500).send( "Error al obtener el cliente" );
    }
};

const actualizarClienteVista = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id).lean();
        if (!cliente) {
            return res.status(404).send( "Cliente no encontrado" );
        }
        res.render("clientes/editar", { cliente });
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        res.status(500).send( "Error al obtener el cliente" );
    }
};

const actualizarClienteVistaPost = async (req, res) => {
    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        
        if (!clienteActualizado) {
            return res.status(404).send( "Cliente no encontrado" );
        }

        res.redirect("/clientes/vista");
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).send( "Error al actualizar el cliente" );
    }
};

const eliminarClienteVista = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id).lean();
        if (!cliente) {
            return res.status(404).send( "Cliente no encontrado" );
        }
        res.render("clientes/eliminar", { cliente });
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        res.status(500).send( "Error al obtener el cliente" );
    }
};

const eliminarClienteVistaPost = async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);    
        if (!clienteEliminado) {
            return res.status(404).send( "Cliente no encontrado" );
        }
        res.redirect("/clientes/vista");
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).send( "Error al eliminar el cliente" );
    }
};

module.exports = {
    // API JSON
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    buscarClientePorCuit,
    // VISTAS
    obtenerClienteVista,
    crearClienteVista,
    crearClienteVistaPost,
    obtenerClienteVistaPorId,
    actualizarClienteVista,
    actualizarClienteVistaPost,
    eliminarClienteVista,
    eliminarClienteVistaPost
};
