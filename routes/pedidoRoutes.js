const express = require("express");
const router = express.Router();

const {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
} = require("../controllers/pedidoController");

router.get("/", obtenerPedidos);
router.get("/:id", obtenerPedidoPorId);
router.post("/", crearPedido);
router.put("/:id", actualizarPedido);
router.delete("/:id", eliminarPedido);

module.exports = router;