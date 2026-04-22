class Cliente {
    constructor(id, nombre, apellido, email, telefono, cuit, domicilio, localidad, provincia, pais, codigoPostal, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.cuit = cuit;
        this.domicilio = domicilio;
        this.localidad = localidad;
        this.provincia = provincia;
        this.pais = pais;
        this.codigoPostal = codigoPostal;
        this.fechaNacimiento = fechaNacimiento;
    }
}

module.exports = Cliente;