const express = require("express");
const router = express.Router();

const {
    obtenerCuentas,
    obtenerCuentaPorCliente,
    registrarPago
} = require("../controllers/cuentaCorrienteController");

router.get("/", obtenerCuentas);
router.get("/cliente/:idCliente", obtenerCuentaPorCliente);
router.get("/vista", cuentaController.obtenerCuentasVista);
router.get("/detalle/:idCliente", cuentaController.obtenerDetalleCuentaVista);
router.post("/pago", registrarPago);

module.exports = router;