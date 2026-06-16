class Producto {
    constructor(id, nombre, descripcion, precio, stock_minimo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock_minimo = stock_minimo;
    }
}

module.exports = Producto;