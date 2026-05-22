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

router.post("/vista/nuevo", crearCuentaVistaPost);
router.post("/vista/cargo", registrarCargaVistaPost);
router.post("/vista/pago", registrarPagoVistaPost);
router.post("/vista/eliminar/:id", eliminarCuentaVistaPost);

router.get("/", obtenerCuentas);
router.get("/cliente/:idCliente", obtenerCuentaPorClienteId);
router.post("/", crearCuenta);
router.post("/pago", registrarPago);
router.post("/cargo", registrarCarga);
router.post("/eliminar/:id", eliminarCuenta);

module.exports = router;
