require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Importar Modelos
const Cliente = require('./models/Cliente');
const Proveedor = require('./models/Proveedor');
const Producto = require('./models/Producto');
const CuentaCorriente = require('./models/CuentaCorriente');
const Pedido = require('./models/Pedido');
const Usuario = require('./models/Usuario');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        await connectDB();
        console.log('Conectado a la base de datos para ejecutar seed...');

        // Limpiar colecciones existentes para evitar conflictos de datos únicos
        await Cliente.deleteMany();
        await Proveedor.deleteMany();
        await Producto.deleteMany();
        await CuentaCorriente.deleteMany();
        await Pedido.deleteMany();
        await Usuario.deleteMany();
        console.log('Colecciones limpiadas exitosamente.');

        // 1. Crear Usuarios
        const passwordHasheada = await bcrypt.hash('password123', 10);
        const usuariosData = [
            { nombre: 'Admin Uno', email: 'admin1@test.com', password: passwordHasheada, rol: 'admin' },
            { nombre: 'Operador Uno', email: 'operador1@test.com', password: passwordHasheada, rol: 'operador' },
            { nombre: 'Operador Dos', email: 'operador2@test.com', password: passwordHasheada, rol: 'operador' }
        ];
        await Usuario.insertMany(usuariosData);
        console.log('Usuarios creados: 3');

        // 2. Crear Productos
        const productosData = [
            { nombre: 'Lavandina 1L', descripcion: 'Lavandina concentrada', precio: 1500, stock: 100, stock_minimo: 20 },
            { nombre: 'Detergente 500ml', descripcion: 'Detergente magistral', precio: 800, stock: 50, stock_minimo: 10 },
            { nombre: 'Escoba', descripcion: 'Escoba de cerda dura', precio: 2500, stock: 30, stock_minimo: 5 }
        ];
        const productos = await Producto.insertMany(productosData);
        console.log('Productos creados: 3');

        // 3. Crear Proveedores
        const proveedoresData = [
            { nombre: 'Limpieza Global SA', cuit: '30-11111111-1', telefono: '11111111', email: 'contacto@limpiezaglobal.com', domicilio: 'Calle 1', localidad: 'CABA', provincia: 'Buenos Aires', pais: 'Argentina', rubro: 'Quimicos', condicionDePago: '30 dias', activo: true },
            { nombre: 'Plasticos Industriales', cuit: '30-22222222-2', telefono: '22222222', email: 'ventas@plasticos.com', domicilio: 'Calle 2', localidad: 'Rosario', provincia: 'Santa Fe', pais: 'Argentina', rubro: 'Plasticos', condicionDePago: 'Contado', activo: true },
            { nombre: 'Distribuidora Norte', cuit: '30-33333333-3', telefono: '33333333', email: 'norte@distribuidora.com', domicilio: 'Calle 3', localidad: 'Cordoba', provincia: 'Cordoba', pais: 'Argentina', rubro: 'Varios', condicionDePago: '15 dias', activo: true }
        ];
        await Proveedor.insertMany(proveedoresData);
        console.log('Proveedores creados: 3');

        // 4. Crear Clientes
        const clientesData = [
            { nombre: 'Juan', apellido: 'Perez', email: 'juan@test.com', telefono: '1111111', cuit: '20-11111111-1', domicilio: 'Av 1', localidad: 'CABA', provincia: 'BA', pais: 'Arg', codigoPostal: '1000', fechaNacimiento: new Date('1990-01-01') },
            { nombre: 'Maria', apellido: 'Gomez', email: 'maria@test.com', telefono: '2222222', cuit: '27-22222222-2', domicilio: 'Av 2', localidad: 'CABA', provincia: 'BA', pais: 'Arg', codigoPostal: '1001', fechaNacimiento: new Date('1995-05-05') },
            { nombre: 'Carlos', apellido: 'Lopez', email: 'carlos@test.com', telefono: '3333333', cuit: '20-33333333-3', domicilio: 'Av 3', localidad: 'CABA', provincia: 'BA', pais: 'Arg', codigoPostal: '1002', fechaNacimiento: new Date('1985-10-10') }
        ];
        const clientes = await Cliente.insertMany(clientesData);
        console.log('Clientes creados: 3');

        // 5. Crear Cuentas Corrientes para los Clientes
        const cuentasCorrientesData = clientes.map((cliente, index) => ({
            cliente: cliente._id,
            saldo: index * 1000, // Ej: 0, 1000, 2000
            limiteCredito: 150000,
            estado: index === 2 ? 'con_deuda' : 'activo',
            historial: index > 0 ? [{ tipo: 'CARGO', monto: index * 1000, descripcion: 'Cargo inicial' }] : []
        }));
        await CuentaCorriente.insertMany(cuentasCorrientesData);
        console.log('Cuentas Corrientes creadas: 3');

        // 6. Crear Pedidos asociados a los Clientes y Productos
        const pedidosData = [
            {
                cliente: clientes[0]._id,
                productos: [{ producto: productos[0]._id, cantidad: 2, precio: 1500 }],
                estado: 'entregado',
                total: 3000
            },
            {
                cliente: clientes[1]._id,
                productos: [
                    { producto: productos[1]._id, cantidad: 1, precio: 800 },
                    { producto: productos[2]._id, cantidad: 1, precio: 2500 }
                ],
                estado: 'enviado',
                total: 3300
            },
            {
                cliente: clientes[2]._id,
                productos: [{ producto: productos[0]._id, cantidad: 5, precio: 1500 }],
                estado: 'pendiente',
                total: 7500
            }
        ];
        await Pedido.insertMany(pedidosData);
        console.log('Pedidos creados: 3');

        console.log('¡Todos los datos de ejemplo fueron generados con éxito!');
        process.exit();
    } catch (error) {
        console.error('Error generando datos de ejemplo:', error);
        process.exit(1);
    }
};

seedData();
