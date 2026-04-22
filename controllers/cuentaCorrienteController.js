const fs = require("fs");
const path = require("path");
const CuentaCorriente = require("../models/CuentaCorriente");

const rutaArchivo = path.join(__dirname, "../data/cuentaCorriente.json");

const leerCuentas = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo de cuentas:", error);
        return [];
    }
};

const escribirArchivo = (datos) => {
    try {
        fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2));
    } catch (error) {
        console.error("Error al escribir el archivo de cuentas:", error);
    }
};

// consultar estado de cuenta

const obtenerCuentas = (req, res) => {
    const cuentas = leerCuentas();
    res.json(cuentas);
};
// consultar cuenta por ID
const obtenerCuentaPorClienteId = (req, res) => {
    const cuentas = leerCuentas();
    const idCliente = parseInt(req.params.idCliente);
    const cuenta = cuentas.find(c => c.idCliente === idCliente);
    if (!cuenta) return res.status(404).json({ message: "Cuenta no encontrada" });
    res.json(cuenta);
};
// registrar pago
const registrarPago = (req, res) => {
    try {
        const cuentas = leerCuentas();
        const { idCliente, monto } = req.body;
        
        if (!idCliente || !monto || monto <= 0) {
            return res.status(400).json({ message: "Faltan datos o el monto es inválido" });
        }

        const cuentaIndex = cuentas.findIndex(c => c.idCliente === parseInt(idCliente));
        if (cuentaIndex === -1) {
            return res.status(404).json({ message: "Cuenta corriente no encontrada" });
        }

        
        cuentas[cuentaIndex].saldo -= parseFloat(monto);
        
        // guardar el movimiento en el historial
        const movimiento = {
            fecha: new Date().toISOString().split("T")[0],
            tipo: "PAGO",
            monto: parseFloat(monto)
        };
        cuentas[cuentaIndex].historial.push(movimiento);

        
        if (cuentas[cuentaIndex].saldo <= cuentas[cuentaIndex].limiteCredito) {
            cuentas[cuentaIndex].estado = "activo";
        }

        escribirArchivo(cuentas);
        res.json({ message: "Pago registrado exitosamente", cuenta: cuentas[cuentaIndex] });

    } catch (error) {
        res.status(500).json({ message: "Error al registrar el pago" });
    }
};

// vista

// todas las cuentas
const obtenerCuentasVista = (req, res) => {
    const cuentas = leerCuentas();
    res.render("cuentas_index", { cuentas });
};

// detalle de una cuenta
const obtenerDetalleCuentaVista = (req, res) => {
    const cuentas = leerCuentas();
    const idCliente = parseInt(req.params.idCliente);
    const cuenta = cuentas.find(c => c.idCliente === idCliente);
    
    if (!cuenta) return res.status(404).send("Cuenta no encontrada");
    
    res.render("cuenta_detail", { cuenta });
};

module.exports = {
    obtenerCuentas,
    obtenerCuentaPorClienteId,
    registrarPago,
    obtenerCuentasVista,
    obtenerDetalleCuentaVista
};