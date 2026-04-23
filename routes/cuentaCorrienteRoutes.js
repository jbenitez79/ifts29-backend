const express = require("express");
const router = express.Router();

const {
    obtenerCuentas,
    obtenerCuentaPorClienteId,
    crearCuenta,
    registrarPago,
    registrarCarga,
    obtenerCuentasVista,
    obtenerDetalleCuentaVista,
    crearCuentaVista,
    editarCuentaVista,
} = require("../controllers/cuentaCorrienteController");

router.get("/vista", obtenerCuentasVista);
router.get("/vista/nuevo", crearCuentaVista);
router.get("/vista/editar/:idCliente", editarCuentaVista);
router.get("/vista/detalle/:idCliente", obtenerDetalleCuentaVista);

router.get("/", obtenerCuentas);
router.get("/cliente/:idCliente", obtenerCuentaPorClienteId);
router.post("/", crearCuenta);
router.post("/pago", registrarPago);
router.post("/cargo", registrarCarga);

module.exports = router;