const express = require("express");
const router = express.Router();

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosVista,
    obtenerProductoPorIdVista,
    crearProductoVista,
    crearProductoVistaPost,
    editarProductoVista,
    actualizarProductoVistaPost,
    eliminarProductoVista,
    eliminarProductoVistaPost,
    buscarProductoPorNombre,
} = require("../controllers/productoController");

router.get("/vista", obtenerProductosVista);
router.get("/vista/nuevo", crearProductoVista);
router.get("/vista/detalle/:id", obtenerProductoPorIdVista);
router.get("/vista/editar/:id", editarProductoVista);
router.get("/vista/eliminar/:id", eliminarProductoVista);

router.post("/vista/nuevo", crearProductoVistaPost);
router.post("/editar/:id", actualizarProductoVistaPost);
router.post("/eliminar/:id", eliminarProductoVistaPost);

router.get("/", obtenerProductos);
router.get("/buscarnombre/:nombre", buscarProductoPorNombre);
router.get("/:id", obtenerProductoPorId);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

module.exports = router;
