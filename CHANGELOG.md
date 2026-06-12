# Changelog

Todas las mejoras notables de este proyecto serán documentadas en este archivo.

## [Unreleased]
### Añadido
- **Autenticación con JWT:** Sistema completo de login utilizando JSON Web Tokens. Los tokens son almacenados en cookies seguras (HttpOnly) con una expiración de 30 minutos.
- **Middleware de Autenticación (`authMiddleware.js`):** Rutas de la API y Vistas protegidas mediante validación del token de sesión. Excepción configurada para la ejecución de tests.
- **Manejo Centralizado de Errores (`errorHandler.js`):** Interceptor de errores a nivel de aplicación que normaliza la salida HTTP en caso de excepciones en controladores o fallas de validación de Mongoose.
- **Configuración Cloud (`package.json`, `db.js`):** 
  - Soporte de `engines` asegurando un entorno compatible (Node.js >= 18).
  - Discriminador en los logs para identificar conexiones a bases locales vs remotas (MongoDB Atlas).
  - Extensión del archivo `.env.example` para incluir parámetros `MONGODB_URI` remotos y `JWT_SECRET`.
- **Datos Iniciales Seguros:** Se ajustó `seed.js` para usar `bcrypt` al generar las claves por defecto, permitiendo un login exitoso de los usuarios de prueba.

### Modificado
- Refactorización de las capturas de errores en los controladores (ej. `authController`) para delegar el control a la función `next(error)` y enviar la ejecución al middleware de errores global.
- Documentación de instalación y despliegue enriquecida en el archivo `README.md` detallando las credenciales por defecto y cómo ejecutar un entorno local con MongoDB.
