const mongoose = require("mongoose");

const movimientoSchema = new mongoose.Schema(
    {
        fecha: {
            type: Date,
            default: Date.now,
        },
        tipo: {
            type: String,
            enum: ["PAGO", "CARGO"],
            required: true,
        },
        monto: {
            type: Number,
            required: true,
        },
        descripcion: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const cuentaCorrienteSchema = new mongoose.Schema(
    {
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            required: true,
            unique: true,
        },
        saldo: {
            type: Number,
            default: 0,
        },
        limiteCredito: {
            type: Number,
            default: 150000,
        },
        estado: {
            type: String,
            enum: ["activo", "con_deuda"],
            default: "activo",
        },
        historial: [movimientoSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("CuentaCorriente", cuentaCorrienteSchema);
