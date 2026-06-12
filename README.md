# TP Backend - Grupo 2

## Integrantes:
- Moreno Diego
- Vivar Edison Cristian
- Vigo Lucrecia
- Benitez Guillermo
- Benitez Julian



## Caso 3: Distribuidora Mayorista "TodoStock S.A." 
Se propone desarrollar un sistema para una empresa familiar dedicada a la comercialización de artículos de limpieza, con más de 20 años de trayectoria, actualmente atravesando un proceso de transición generacional en su conducción. La organización presenta dificultades derivadas de una estructura jerárquica tradicional con toma de decisiones informales, coexistencia de criterios de gestión entre el fundador y sus hijos, y ausencia de integración entre procesos de compras, ventas y cobranzas. El objetivo del trabajo es diseñar e implementar un sistema que permita registrar productos, proveedores, clientes, movimientos de stock y cuentas corrientes, organizar la información del proceso de compras e inventario, mejorar la trazabilidad de los productos y generar información confiable para la toma de decisiones operativas en el marco de un proceso de profesionalización organizacional.
El sistema deberá permitir modelar el proceso de compras, registrar operaciones de ingreso y egreso de mercadería, implementar un módulo de inventario con control de stock mínimo y trazabilidad por lotes bajo el criterio FEFO (primero en vencer, primero en salir), y representar el estado de las cuentas corrientes de clientes vinculadas a despachos y cobranzas. Asimismo, deberá incorporar mecanismos de alerta ante situaciones de falta de stock o sobrestock de productos próximos a vencer, y generar resúmenes operativos que permitan mejorar la previsibilidad del flujo de mercadería y del flujo de caja. Además, deberá contemplar el análisis del rol del sistema informático como herramienta de transición hacia un modelo de gestión más profesional y menos dependiente de decisiones informales.
El sistema deberá diseñarse siguiendo una arquitectura modular con separación entre modelos, rutas, servicios y almacenamiento en memoria, validar datos obligatorios evitando inconsistencias en registros de inventario y cuentas corrientes, responder en formato JSON utilizando códigos HTTP adecuados y contemplar criterios de mantenibilidad y escalabilidad que permitan su futura integración con bases de datos como MongoDB y con un frontend administrativo. La implementación deberá reflejar buenas prácticas de desarrollo backend orientadas a construir una fuente única de información confiable, favoreciendo la trazabilidad de productos, la transparencia en los procesos operativos y el acompañamiento tecnológico del proceso de cambio organizacional.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Pug
- bcrypt

## Módulos implementados
- Clientes
- Productos
- Proveedores
- Pedidos
- Cuenta Corriente
- Autenticación básica

## Funcionalidades
- CRUD completo
- Persistencia con MongoDB
- Relaciones entre colecciones
- Validaciones con Mongoose
- Manejo de stock
- Vistas con Pug
- API REST

## Instalación

### Clonar el repositorio:

git clone https://github.com/jbenitez79/ifts29-backend.git

### Instalar dependencias:

npm install

### Variables de entorno

Crear archivo `.env` en la raíz del proyecto usando `.env.example` como referencia:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todostock
JWT_SECRET=super_secret_key
```

### Ejecución Local

1. Asegúrate de tener el servicio de **MongoDB** en ejecución en tu máquina (por ejemplo, a través de Windows Services, Docker o lanzando `mongod`).
2. Generar datos iniciales (opcional pero recomendado):
   ```bash
   npm run seed
   ```
3. Levantar el servidor:
   - Modo desarrollo:
     `npm run dev`
   - Modo producción:
     `npm start`

### Acceso a la aplicación:

http://localhost:3000

### Usuario por defecto:
Tras ejecutar `npm run seed`, se crearán usuarios por defecto. Puedes ingresar usando:
- **Email:** admin1@test.com
- **Password:** password123

### Registrar usuario:

http://localhost:3000/register

## Despliegue en la Nube

Para desplegar la aplicación en servicios cloud (como Render, Railway o Heroku):
1. Crear un cluster en **MongoDB Atlas** y obtener la URL de conexión.
2. En la plataforma de hosting, definir las variables de entorno (`NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`).
3. Especificar el comando de inicio (ej. `npm start`).
4. La configuración de `engines` en `package.json` ya garantiza la compatibilidad con Node.js v18+.