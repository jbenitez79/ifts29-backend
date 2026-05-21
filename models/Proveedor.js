const mongoose = require("mongoose");

const proveedorSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },

        cuit: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        telefono: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },

        domicilio: {
            type: String,
            required: true,
        },

        localidad: {
            type: String,
            required: true,
        },

        provincia: {
            type: String,
            required: true,
        },

        pais: {
            type: String,
            required: true,
        },

        rubro: {
            type: String,
            required: true,
        },

        condicionDePago: {
            type: String,
            required: true,
        },

        activo: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Proveedor", proveedorSchema);
