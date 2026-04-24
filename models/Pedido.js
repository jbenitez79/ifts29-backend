class Pedido {
    constructor(id, idCliente, productos, fecha, estado = "pendiente") {
        this.id = id;
        this.idCliente = idCliente;
        this.productos = productos;
        this.fecha = fecha;
        this.estado = estado;
        this.total = this.calcularTotal();
    }

    calcularTotal() {
        if (!this.productos || !Array.isArray(this.productos)) return 0;
        return this.productos.reduce((sum, prod) => sum + (prod.cantidad * prod.precio), 0);
    }
}

module.exports = Pedido;