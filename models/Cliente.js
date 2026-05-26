const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },

        apellido: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        telefono: {
            type: String,
            required: true,
        },

        cuit: {
            type: String,
            required: true,
            unique: true,
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

        codigoPostal: {
            type: String,
            required: true,
        },

        fechaNacimiento: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cliente", clienteSchema);