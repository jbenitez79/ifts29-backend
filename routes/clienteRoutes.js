const express = require("express");
// Este router permite definir rutas en un archivo separado del servidor principal
const router = express.Router();

const {
    obtenerClientes,
    obtenerClienteVista,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerNuevoClienteVista
} = require("../controllers/ClienteController");

// rutas CRUD

router.get("/", obtenerClientes);
router.get("/vista", obtenerClienteVista);
router.get("/nuevo", obtenerNuevoClienteVista);
router.get("/:id", obtenerClientePorId);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);


module.exports = router;