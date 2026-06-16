class CuentaCorriente {
    constructor(id, idCliente, saldo = 0, limiteCredito = 150000, estado = "activo", historial = []) {
        this.id = id;
        this.idCliente = parseInt(idCliente);
        this.saldo = parseFloat(saldo);
        this.limiteCredito = parseFloat(limiteCredito);
        this.estado = estado;
        this.historial = historial;
    }
}

module.exports = CuentaCorriente;