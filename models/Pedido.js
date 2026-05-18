const mongoose = require("mongoose");

const pedidoProductoSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        },
        precio: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const pedidoSchema = new mongoose.Schema(
    {
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            required: true,
        },
        productos: [pedidoProductoSchema],
        fecha: {
            type: Date,
            default: Date.now,
        },
        estado: {
            type: String,
            enum: ["pendiente", "aprobado", "enviado", "entregado", "cancelado"],
            default: "pendiente",
        },
        total: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Pedido", pedidoSchema);
