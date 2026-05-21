const express = require("express");
const router = express.Router();

const {
    obtenerCuentas,
    obtenerCuentaPorClienteId,
    crearCuenta,
    registrarPago,
    registrarCarga,
    eliminarCuenta,
    obtenerCuentasVista,
    obtenerDetalleCuentaVista,
    crearCuentaVista,
    crearCuentaVistaPost,
    editarCuentaVista,
    registrarCargaVistaPost,
    registrarPagoVistaPost,
    eliminarCuentaVista,
    eliminarCuentaVistaPost,
} = require("../controllers/cuentaCorrienteController");

router.get("/vista", obtenerCuentasVista);
router.get("/vista/nuevo", crearCuentaVista);
router.get("/vista/detalle/:id", obtenerDetalleCuentaVista);
router.get("/vista/editar/:id", editarCuentaVista);
router.get("/vista/eliminar/:id", eliminarCuentaVista);

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
