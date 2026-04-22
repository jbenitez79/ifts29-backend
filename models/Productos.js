class Producto {
    constructor(id, nombre, descripcion, precio, stock, stock_minimo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.stock_minimo = stock_minimo;
    }
}

module.exports = Producto;