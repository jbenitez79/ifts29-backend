const express = require("express");
// Este router permite definir rutas en un archivo separado del servidor principal
const router = express.Router();

const {
    obtenerProveedores,
    obtenerProveedorVista,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    obtenerProveedorDetalle,
} = require("../controllers/proveedorController");

// rutas CRUD
router.get("/", obtenerProveedores);
router.get("/vista", obtenerProveedorVista);
router.get("/:id", obtenerProveedorPorId);
router.post("/", crearProveedor);
router.put("/:id", actualizarProveedor);
router.delete("/:id", eliminarProveedor);
router.get("/detalle/:id", obtenerProveedorDetalle);

module.exports = router;