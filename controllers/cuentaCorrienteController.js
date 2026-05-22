const CuentaCorriente = require("../models/CuentaCorriente");
const Cliente = require("../models/Cliente");

const obtenerCuentas = async (req, res) => {
    try {
        const cuentas = await CuentaCorriente.find().populate("cliente");
        res.json(cuentas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las cuentas" });
    }
};

const obtenerCuentaPorClienteId = async (req, res) => {
    try {
        const cuenta = await CuentaCorriente.findOne({
            cliente: req.params.idCliente,
        }).populate("cliente");
        if (!cuenta) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }
        res.json(cuenta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la cuenta" });
    }
};

const crearCuenta = async (req, res) => {
    try {
        const { cliente, limiteCredito } = req.body;

        if (!cliente) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const existe = await CuentaCorriente.findOne({ cliente });
        if (existe) {
            return res
                .status(400)
                .json({ message: "El cliente ya tiene cuenta corriente" });
        }

        const nuevaCuenta = await CuentaCorriente.create({
            cliente,
            limiteCredito: parseFloat(limiteCredito) || 150000,
        });

        res.status(201).json(nuevaCuenta);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la cuenta" });
    }
};

const registrarPago = async (req, res) => {
    try {
        const { idCliente, monto } = req.body;

        if (!idCliente || !monto || parseFloat(monto) <= 0) {
            return res
                .status(400)
                .json({ message: "Faltan datos o el monto es inválido" });
        }

        const cuenta = await CuentaCorriente.findById(idCliente);
        if (!cuenta) {
            return res
                .status(404)
                .json({ message: "Cuenta corriente no encontrada" });
        }

        cuenta.saldo -= parseFloat(monto);

        cuenta.historial.push({
            fecha: new Date(),
            tipo: "PAGO",
            monto: parseFloat(monto),
        });

        if (cuenta.saldo <= cuenta.limiteCredito) {
            cuenta.estado = "activo";
        }

        await cuenta.save();

        res.json({
            message: "Pago registrado exitosamente",
            cuenta,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el pago" });
    }
};

const registrarCarga = async (req, res) => {
    try {
        const { idCliente, monto, descripcion } = req.body;

        if (!idCliente || !monto || parseFloat(monto) <= 0) {
            return res
                .status(400)
                .json({ message: "Faltan datos o el monto es inválido" });
        }

        const cuenta = await CuentaCorriente.findById(idCliente);
        if (!cuenta) {
            return res
                .status(404)
                .json({ message: "Cuenta corriente no encontrada" });
        }

        cuenta.saldo += parseFloat(monto);

        cuenta.historial.push({
            fecha: new Date(),
            tipo: "CARGO",
            monto: parseFloat(monto),
            descripcion: descripcion || "",
        });

        if (cuenta.saldo > cuenta.limiteCredito) {
            cuenta.estado = "con_deuda";
        }

        await cuenta.save();

        res.json({
            message: "Carga registrada exitosamente",
            cuenta,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar la carga" });
    }
};

const eliminarCuenta = async (req, res) => {
    try {
        const cuenta = await CuentaCorriente.findById(req.params.id);

        if (!cuenta) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        if (cuenta.saldo > 0) {
            return res
                .status(400)
                .json({
                    message: "No se puede eliminar una cuenta con saldo pendiente",
                });
        }

        await CuentaCorriente.findByIdAndDelete(req.params.id);

        res.json({ message: "Cuenta eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la cuenta" });
    }
};

const normalizeFechaMov = (mov) => {
    if (mov.fecha && typeof mov.fecha === "string")
        mov.fecha = new Date(mov.fecha);
    return mov;
};

const normalizeFechaCuenta = (cuenta) => {
    if (cuenta.historial) {
        cuenta.historial = cuenta.historial.map(normalizeFechaMov);
    }
    if (cuenta.fecha && typeof cuenta.fecha === "string")
        cuenta.fecha = new Date(cuenta.fecha);
    return cuenta;
};

const obtenerCuentasVista = async (req, res) => {
    try {
        let cuentas = await CuentaCorriente.find()
            .populate("cliente")
            .lean();
        cuentas = cuentas.map(normalizeFechaCuenta);
        res.render("cuentas/index", { cuentas });
    } catch (error) {
        res.status(500).send("Error al obtener las cuentas");
    }
};

const obtenerDetalleCuentaVista = async (req, res) => {
    try {
        let cuenta = await CuentaCorriente.findById(req.params.id)
            .populate("cliente")
            .lean();
        if (!cuenta) {
            return res.status(404).send("Cuenta no encontrada");
        }
        cuenta = normalizeFechaCuenta(cuenta);
        res.render("cuentas/detalle", { cuenta });
    } catch (error) {
        res.status(500).send("Error al obtener la cuenta");
    }
};

const crearCuentaVista = async (req, res) => {
    try {
        const clientes = await Cliente.find().lean();
        res.render("cuentas/nuevo", { clientes });
    } catch (error) {
        res.status(500).send("Error al cargar el formulario");
    }
};

const crearCuentaVistaPost = async (req, res) => {
    try {
        const { idCliente, limiteCredito } = req.body;

        if (!idCliente) {
            return res.status(400).send("Faltan datos");
        }

        const existe = await CuentaCorriente.findOne({ cliente: idCliente });
        if (existe) {
            return res
                .status(400)
                .send("El cliente ya tiene cuenta corriente");
        }

        await CuentaCorriente.create({
            cliente: idCliente,
            limiteCredito: parseFloat(limiteCredito) || 150000,
        });

        res.redirect("/cuentas/vista");
    } catch (error) {
        res.status(500).send("Error al crear la cuenta");
    }
};

const editarCuentaVista = async (req, res) => {
    try {
        let cuenta = await CuentaCorriente.findById(req.params.id)
            .populate("cliente")
            .lean();
        if (!cuenta) {
            return res.status(404).send("Cuenta no encontrada");
        }
        cuenta = normalizeFechaCuenta(cuenta);
        res.render("cuentas/editar", { cuenta });
    } catch (error) {
        res.status(500).send("Error al obtener la cuenta");
    }
};

const registrarCargaVistaPost = async (req, res) => {
    try {
        const { cuentaId, monto, descripcion } = req.body;

        if (!cuentaId || !monto || parseFloat(monto) <= 0) {
            return res
                .status(400)
                .send("Faltan datos o el monto es inválido");
        }

        const cuenta = await CuentaCorriente.findById(cuentaId);
        if (!cuenta) {
            return res.status(404).send("Cuenta corriente no encontrada");
        }

        cuenta.saldo += parseFloat(monto);

        cuenta.historial.push({
            fecha: new Date(),
            tipo: "CARGO",
            monto: parseFloat(monto),
            descripcion: descripcion || "",
        });

        if (cuenta.saldo > cuenta.limiteCredito) {
            cuenta.estado = "con_deuda";
        }

        await cuenta.save();

        res.redirect("/cuentas/vista");
    } catch (error) {
        res.status(500).send("Error al registrar la carga");
    }
};

const registrarPagoVistaPost = async (req, res) => {
    try {
        const { cuentaId, monto } = req.body;

        if (!cuentaId || !monto || parseFloat(monto) <= 0) {
            return res
                .status(400)
                .send("Faltan datos o el monto es inválido");
        }

        const cuenta = await CuentaCorriente.findById(cuentaId);
        if (!cuenta) {
            return res.status(404).send("Cuenta corriente no encontrada");
        }

        cuenta.saldo -= parseFloat(monto);

        cuenta.historial.push({
            fecha: new Date(),
            tipo: "PAGO",
            monto: parseFloat(monto),
        });

        if (cuenta.saldo <= cuenta.limiteCredito) {
            cuenta.estado = "activo";
        }

        await cuenta.save();

        res.redirect("/cuentas/vista");
    } catch (error) {
        res.status(500).send("Error al registrar el pago");
    }
};

const eliminarCuentaVista = async (req, res) => {
    try {
        let cuenta = await CuentaCorriente.findById(req.params.id)
            .populate("cliente")
            .lean();
        if (!cuenta) {
            return res.status(404).send("Cuenta no encontrada");
        }
        cuenta = normalizeFechaCuenta(cuenta);
        res.render("cuentas/eliminar", { cuenta });
    } catch (error) {
        res.status(500).send("Error al obtener la cuenta");
    }
};

const eliminarCuentaVistaPost = async (req, res) => {
    try {
        const cuenta = await CuentaCorriente.findById(req.params.id);
        if (!cuenta) {
            return res.status(404).send("Cuenta no encontrada");
        }

        if (cuenta.saldo > 0) {
            return res
                .status(400)
                .send("No se puede eliminar una cuenta con saldo pendiente");
        }

        await CuentaCorriente.findByIdAndDelete(req.params.id);

        res.redirect("/cuentas/vista");
    } catch (error) {
        res.status(500).send("Error al eliminar la cuenta");
    }
};

module.exports = {
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
};
