class Proveedor {
    constructor(id, nombre, cuit, telefono, email, domicilio, localidad, provincia, pais, rubro, condicionDePago, activo = true) {
        this.id = id;
        this.nombre = nombre;
        this.cuit = cuit;
        this.telefono = telefono;
        this.email = email;
        this.domicilio = domicilio;
        this.localidad = localidad;
        this.provincia = provincia;
        this.pais = pais;
        this.rubro = rubro;
        this.condicionDePago = condicionDePago; // Acá podemos cambiarlo "contado", "débito", "crédito"
        this.activo = activo;
    }
}

module.exports = Proveedor;