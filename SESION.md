# Reporte de Sesión - Análisis del Proyecto

**Fecha:** 23/04/2026
**Proyecto:** ifts29-backend (TodoStock S.A.)

---

## 1. Estructura del Proyecto

| Componente | Archivos | Estado |
|------------|----------|--------|
| **Routes** | `clienteRoutes.js`, `pedidoRoutes.js`, `productoRoutes.js`, `cuentaCorrienteRoutes.js` | ✓ Completo |
| **Controllers** | `clienteController.js`, `pedidoController.js`, `productoController.js`, `cuentaCorrienteController.js` | ✓ Completo |
| **Views** | `clientes/*.pug` (5), `pedidos/*.pug` (5), `cuentas/*.pug` (4) | ✓ Completo |
| **Main** | `app.js`, `layout.pug`, `index.pug` | ✓ Configurado |

**Stack:** Express.js + Pug templates + body-parser + method-override

---

## 2. Módulo Pedidos

### Funcionalidades implementadas:
- Crear pedido buscando cliente por CUIT
- Buscar producto por nombre
- Lista con: fecha, CUIT, cliente, estado, cantidad productos, total
- Detalle con tabla de productos
- Estados: pendiente, aprobado, enviado, entregado, cancelado
- Descuento de stock al crear pedido
- Restitución de stock al cancelar

### Rutas corregidas:
- `/pedidos/vista` - lista
- `/pedidos/nuevo` - crear
- `/pedidos/:id/vista` - detalle
- `/pedidos/editar/:id` - editar
- `/pedidos/eliminar/:id` - eliminar
- POST `/pedidos/editar/:id` - guardar edición
- POST `/pedidos/eliminar/:id` - confirmar eliminación

---

## 3. Módulo Cuentas Corrientes

### Funcionalidades:
- Crear cuenta corriente por cliente
- Registrar pagos (disminuye saldo)
- Registrar cargas (aumenta saldo)
- Historial de movimientos
- Eliminar cuenta (solo si saldo = 0)

### Rutas:
- `/cuentas/vista` - lista
- `/cuentas/vista/nuevo` - crear cuenta
- `/cuentas/vista/detalle/:idCliente` - detalle
- `/cuentas/vista/editar/:idCliente` - cargar/pagar
- POST `/cuentas/pago` - registrar pago
- POST `/cuentas/cargo` - registrar carga
- POST `/cuentas/eliminar/:idCliente` - eliminar

### Cambios recientes:
- Registrar pago ahora redirige a `/cuentas/vista`
- Registrar carga ahora redirige a `/cuentas/vista`
- Agregada acción eliminar en lista

---

## 4. Menú Principal (index.pug)

| Módulo | Link |
|--------|------|
| Clientes | `/clientes/vista` |
| Productos | "#" (próximamente) |
| Proveedores | "#" (próximamente) |
| Cuentas Corrientes | "/cuentas/vista" |
| Pedidos | `/pedidos/vista` |