require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;


const clienteRoutes = require("./routes/clienteRoutes");

app.use(express.json());
//middleware que puedr leer los datos enviados desde formularios HTML (method="POST").
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});