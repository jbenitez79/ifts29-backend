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
    obtenerNuevoPedidoVista,
    obtenerEditarPedidoVista,
} = require("../controllers/pedidoController");

router.get("/vista", obtenerPedidosVista);
router.get("/nuevo", obtenerNuevoPedidoVista);
router.get("/editar/:id", obtenerEditarPedidoVista);
router.get("/:id/vista", obtenerPedidoPorIdVista);
router.get("/", obtenerPedidos);
router.get("/:id", obtenerPedidoPorId);
router.post("/", crearPedido);
router.put("/:id", actualizarPedido);
router.delete("/:id", eliminarPedido);

module.exports = router;