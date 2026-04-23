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

router.get("/vista", obtenerPedidosVista);
router.get("/nuevo", crearPedidoVista);
router.get("/editar/:id", actualizarPedidoVista);
router.get("/eliminar/:id", eliminarPedidoVista);
router.get("/:id/vista", obtenerPedidoPorIdVista);

router.post("/nuevo", crearPedido);
router.post("/editar/:id", actualizarPedido);
router.post("/eliminar/:id", eliminarPedido);

router.get("/", obtenerPedidos);
router.get("/:id", obtenerPedidoPorId);
router.post("/", crearPedido);
router.put("/:id", actualizarPedido);
router.delete("/:id", eliminarPedido);

module.exports = router;