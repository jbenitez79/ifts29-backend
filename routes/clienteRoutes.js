const express = require("express");
// Este router permite definir rutas en un archivo separado del servidor principal
const router = express.Router();

const {
    obtenerClientes,
    obtenerClienteVista,
    obtenerClientePorId,
    crearCliente,
    crearClienteVista,
    crearClienteVistaPost,
    actualizarCliente,
    eliminarCliente,
    obtenerClienteVistaPorId,
    actualizarClienteVista,
    actualizarClienteVistaPost,
    eliminarClienteVista,
    buscarClientePorCuit,
    eliminarClienteVistaPost
} = require("../controllers/clienteController");

// rutas CRUD

// Respuesta HTML
router.get("/vista", obtenerClienteVista);
router.get("/vista/nuevo", crearClienteVista);
router.get("/vista/detalle/:id", obtenerClienteVistaPorId);
router.get("/vista/editar/:id", actualizarClienteVista);
router.get("/vista/eliminar/:id", eliminarClienteVista);

// Envío de formularios HTML
router.post("/vista/nuevo", crearClienteVistaPost);
router.post("/editar/:id", actualizarClienteVistaPost);
router.post("/eliminar/:id", eliminarClienteVistaPost);

// Respuesta JSON
router.get("/", obtenerClientes);
router.get("/buscarcuit/:cuit", buscarClientePorCuit);
router.get("/:id", obtenerClientePorId);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);


module.exports = router;