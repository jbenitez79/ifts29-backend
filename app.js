require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const app = express();

const PORT = process.env.PORT || 3000;


const clienteRoutes = require("./routes/clienteRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const productoRoutes = require("./routes/productoRoutes");

const cuentaCorrienteRoutes = require("./routes/cuentaCorrienteRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Configura el motor de vistas Pug. Permite generar páginas HTML dinámicas desde el servidor. Es el motor de vistas
app.set("view engine", "pug");
app.set("views", "./views");

//permite servir archivos estáticos desde la carpeta public como CSS o imágenes. (En nuestro ejemplo no usamos)
app.use(express.static("public"));

// rutas
app.get("/", (req, res) => {
    res.render("index");
});
app.use("/clientes", clienteRoutes);
app.use("/pedidos", pedidoRoutes);

app.use("/productos", productoRoutes);

app.use("/cuentas", cuentaCorrienteRoutes);

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});