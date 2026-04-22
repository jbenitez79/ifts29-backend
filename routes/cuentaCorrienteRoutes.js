const express = require("express");
const router = express.Router();


const {
    obtenerCuentas,
    obtenerCuentaPorClienteId,
    registrarPago,
    obtenerCuentasVista,
    obtenerDetalleCuentaVista
} = require("../controllers/cuentaCorrienteController");


router.get("/", obtenerCuentas);
router.get("/cliente/:idCliente", obtenerCuentaPorClienteId);
router.get("/vista", obtenerCuentasVista)
router.get("/detalle/:idCliente", obtenerDetalleCuentaVista); 
router.post("/pago", registrarPago);

module.exports = router;