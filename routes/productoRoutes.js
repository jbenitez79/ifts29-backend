const express = require("express");
// Este router permite definir rutas en un archivo separado del servidor principal
const router = express.Router();

const {
    obtenerProductos,
    obtenerProductoVista,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/ProductoController");

// rutas CRUD

router.get("/", obtenerProductos);
router.get("/vista", obtenerProductoVista);
router.get("/:id", obtenerProductoPorId);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);


module.exports = router;