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
