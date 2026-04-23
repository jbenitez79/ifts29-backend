const fs = require("fs");
const path = require("path");
const rutaArchivo = path.join(__dirname, "../data/cuentaCorriente.json");

const leerCuentas = () => {
    try {
        const data = fs.readFileSync(rutaArchivo, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const guardarCuentas = (datos) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2));
};

const obtenerCuentas = (req, res) => {
    try {
        const cuentas = leerCuentas();
        res.json(cuentas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las cuentas" });
    }
};

const obtenerCuentaPorClienteId = (req, res) => {
    try {
        const cuentas = leerCuentas();
        const idCliente = parseInt(req.params.idCliente);
        const cuenta = cuentas.find(c => c.idCliente === idCliente);
        if (!cuenta) return res.status(404).json({ message: "Cuenta no encontrada" });
        res.json(cuenta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la cuenta" });
    }
};

const crearCuenta = (req, res) => {
    try {
        const cuentas = leerCuentas();
        const { idCliente, limiteCredito } = req.body;

        if (!idCliente) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        if (cuentas.find(c => c.idCliente === parseInt(idCliente))) {
            return res.status(400).json({ message: "El cliente ya tiene cuenta corriente" });
        }

        const nuevaCuenta = {
            id: Math.max(...cuentas.map(c => c.id), 0) + 1,
            idCliente: parseInt(idCliente),
            saldo: 0,
            limiteCredito: parseFloat(limiteCredito) || 150000,
            estado: "activo",
            historial: []
        };

        cuentas.push(nuevaCuenta);
        guardarCuentas(cuentas);

        if (req.xhr || req.headers.accept?.includes("json")) {
            res.status(201).json(nuevaCuenta);
        } else {
            res.redirect("/cuentas/vista");
        }
    } catch (error) {
        res.status(500).json({ message: "Error al crear la cuenta" });
    }
};

const registrarPago = (req, res) => {
    try {
        const cuentas = leerCuentas();
        const { idCliente, monto } = req.body;

        if (!idCliente || !monto || parseFloat(monto) <= 0) {
            return res.status(400).json({ message: "Faltan datos o el monto es inválido" });
        }

        const cuentaIndex = cuentas.findIndex(c => c.idCliente === parseInt(idCliente));
        if (cuentaIndex === -1) {
            return res.status(404).json({ message: "Cuenta corriente no encontrada" });
        }

        cuentas[cuentaIndex].saldo -= parseFloat(monto);

        const movimiento = {
            fecha: new Date().toISOString().split("T")[0],
            tipo: "PAGO",
            monto: parseFloat(monto)
        };
        cuentas[cuentaIndex].historial.push(movimiento);

        if (cuentas[cuentaIndex].saldo <= cuentas[cuentaIndex].limiteCredito) {
            cuentas[cuentaIndex].estado = "activo";
        }

        guardarCuentas(cuentas);
        res.json({ message: "Pago registrado exitosamente", cuenta: cuentas[cuentaIndex] });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el pago" });
    }
};

const registrarCarga = (req, res) => {
    try {
        const cuentas = leerCuentas();
        const { idCliente, monto, descripcion } = req.body;

        if (!idCliente || !monto || parseFloat(monto) <= 0) {
            return res.status(400).json({ message: "Faltan datos o el monto es inválido" });
        }

        const cuentaIndex = cuentas.findIndex(c => c.idCliente === parseInt(idCliente));
        if (cuentaIndex === -1) {
            return res.status(404).json({ message: "Cuenta corriente no encontrada" });
        }

        cuentas[cuentaIndex].saldo += parseFloat(monto);

        const movimiento = {
            fecha: new Date().toISOString().split("T")[0],
            tipo: "CARGO",
            monto: parseFloat(monto),
            descripcion: descripcion || ""
        };
        cuentas[cuentaIndex].historial.push(movimiento);

        if (cuentas[cuentaIndex].saldo > cuentas[cuentaIndex].limiteCredito) {
            cuentas[cuentaIndex].estado = "con_deuda";
        }

        guardarCuentas(cuentas);
        res.json({ message: "Carga registrada exitosamente", cuenta: cuentas[cuentaIndex] });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar la carga" });
    }
};

const obtenerCuentasVista = (req, res) => {
    const cuentas = leerCuentas();
    res.render("cuentas/index", { cuentas });
};

const obtenerDetalleCuentaVista = (req, res) => {
    const cuentas = leerCuentas();
    const idCliente = parseInt(req.params.idCliente);
    const cuenta = cuentas.find(c => c.idCliente === idCliente);

    if (!cuenta) return res.status(404).send("Cuenta no encontrada");

    res.render("cuentas/detail", { cuenta });
};

const crearCuentaVista = (req, res) => {
    res.render("cuentas/nuevo");
};

const editarCuentaVista = (req, res) => {
    const cuentas = leerCuentas();
    const idCliente = parseInt(req.params.idCliente);
    const cuenta = cuentas.find(c => c.idCliente === idCliente);

    if (!cuenta) return res.status(404).send("Cuenta no encontrada");

    res.render("cuentas/editar", { cuenta });
};

module.exports = {
    obtenerCuentas,
    obtenerCuentaPorClienteId,
    crearCuenta,
    registrarPago,
    registrarCarga,
    obtenerCuentasVista,
    obtenerDetalleCuentaVista,
    crearCuentaVista,
    editarCuentaVista,
};