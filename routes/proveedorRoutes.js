const express = require("express");
const router = express.Router();

const {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    obtenerProveedorVista,
    obtenerProveedorDetalle,
    crearProveedorVista,
    crearProveedorVistaPost,
    actualizarProveedorVista,
    actualizarProveedorVistaPost,
    eliminarProveedorVista,
    eliminarProveedorVistaPost,
} = require("../controllers/proveedorController");

router.get("/vista", obtenerProveedorVista);
router.get("/vista/nuevo", crearProveedorVista);
router.get("/vista/editar/:id", actualizarProveedorVista);
router.get("/vista/eliminar/:id", eliminarProveedorVista);
router.get("/detalle/:id", obtenerProveedorDetalle);

router.post("/vista/nuevo", crearProveedorVistaPost);
router.post("/editar/:id", actualizarProveedorVistaPost);
router.post("/eliminar/:id", eliminarProveedorVistaPost);

router.get("/", obtenerProveedores);
router.get("/:id", obtenerProveedorPorId);
router.post("/", crearProveedor);
router.put("/:id", actualizarProveedor);
router.delete("/:id", eliminarProveedor);

module.exports = router;
