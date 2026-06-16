const express = require("express");
const router = express.Router();

const {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidosVista,
    obtenerPedidoPorIdVista,
    crearPedidoVista,
    actualizarPedidoVista,
    eliminarPedidoVista,
} = require("../controllers/pedidoController");

//Vistas
router.get("/vista", obtenerPedidosVista);
router.get("/vista/nuevo", crearPedidoVista);
router.get("/vista/detalle/:id", obtenerPedidoPorIdVista);
router.get("/vista/editar/:id", actualizarPedidoVista);
router.get("/vista/eliminar/:id", eliminarPedidoVista);

//Formularios
router.post("/editar/:id", actualizarPedido);
router.post("/eliminar/:id", eliminarPedido);

//APIs
router.get("/", obtenerPedidos);
router.get("/:id", obtenerPedidoPorId);
router.post("/", crearPedido);
router.put("/:id", actualizarPedido);
router.delete("/:id", eliminarPedido);

module.exports = router;