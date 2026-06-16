# Guía de Ejecución de Pruebas (Testing)

Este proyecto cuenta con un entorno de pruebas de integración y E2E (End-to-End) automatizado configurado con **Jest** y **Supertest**. 

Las pruebas se ejecutan contra la base de datos real configurada en tu `.env`, asegurando un entorno realista. Los tests están diseñados para limpiar sus propios datos residuales tras finalizar (a través del hook `afterAll`), de forma que no alteran ni ensucian los registros de tu base de datos principal.

## 1. Requisitos Previos

*   Haber seguido exitosamente los pasos de la **Guía de Ejecución Local**.
*   Asegurarse de tener las dependencias de desarrollo instaladas (`npm install`).
*   MongoDB debe estar en ejecución.

## 2. Ejecutar Todo el Suite de Pruebas

Para ejecutar absolutamente todas las pruebas del proyecto (esto incluye tests generales de endpoints y tests rigurosos de QA), abre una terminal en la raíz y ejecuta:

```bash
npm test
```

Este comando:
1. Iniciará Jest de forma automatizada (estableciendo la variable de entorno `NODE_ENV=test`).
2. Interactuará temporalmente con tu base de datos y levantará la aplicación sin ocupar el puerto de red real.
3. Al finalizar, imprimirá una tabla de **Test Coverage (Cobertura de Código)** en consola indicando qué porcentaje del código fuente y funciones fueron evaluados exitosamente.

## 3. Ejecutar Pruebas Específicas

Si estás trabajando en una funcionalidad puntual y solo quieres correr las pruebas de la carpeta QA (Quality Assurance), puedes indicar la ruta específica:

```bash
# Correr exclusivamente los tests detallados de QA (CRUD para cada modelo)
npm test tests/qa/

# Correr los tests generales de todos los endpoints
npm test tests/allEndpoints.test.js

# Correr las pruebas de un único archivo específico
npm test tests/qa/cliente.qa.test.js
```

## 4. Notas sobre el Entorno de Test

* **Silencio de puerto:** Gracias al diseño de `app.js`, la aplicación solo llama a `app.listen` cuando el entorno NO es `test`. Esto previene el error frecuente de "EADDRINUSE" (puerto en uso) durante las pruebas con Supertest.
* **Seguridad de los datos:** Ningún test destruye datos legítimos. Los escenarios de QA E2E crean entidades con prefijos específicos (como IDs preestablecidos o sufijos `QA-`) y realizan sus verificaciones sobre ellos, borrándolos automáticamente del sistema antes de finalizar.
