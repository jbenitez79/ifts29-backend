// Cargar variables de entorno
require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const app = express();

const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/authRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const productoRoutes = require("./routes/productoRoutes");
const cuentaCorrienteRoutes = require("./routes/cuentaCorrienteRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const authorizeRoles = require("./middlewares/authorizeRoles");

// Iniciar la conexión a la base de datos
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Configura el motor de vistas Pug. Permite generar páginas HTML dinámicas desde el servidor. Es el motor de vistas
app.set("view engine", "pug");
app.set("views", "./views");

//permite servir archivos estáticos desde la carpeta public como CSS o imágenes. (En nuestro ejemplo no usamos)
app.use(express.static("public"));

// rutas
app.get("/", (req, res) => {
    res.redirect("/login");
});
app.get("/index", authMiddleware,(req, res) => {
    res.render("index");
});

app.use("/", authRoutes);

// Rutas protegidas
//app.use("/index", authMiddleware);
app.use("/clientes", authMiddleware, clienteRoutes);
app.use("/productos", authMiddleware, authorizeRoles('admin'), productoRoutes);
app.use("/proveedores", authMiddleware, authorizeRoles('admin'), proveedorRoutes);
app.use("/pedidos", authMiddleware, pedidoRoutes);
app.use("/cuentas", authMiddleware, cuentaCorrienteRoutes);

// Manejador de errores global (debe ir después de las rutas)
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log("Servidor corriendo en puerto " + PORT);
    });
}

module.exports = app;