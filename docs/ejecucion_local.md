# Guía de Ejecución Local

Esta guía describe los pasos necesarios para levantar el proyecto `ifts29-backend` en tu entorno local.

## 1. Requisitos Previos

*   **Node.js**: Debes tener Node.js instalado (recomendado v16 o superior).
*   **MongoDB**: Se requiere una instancia de MongoDB en ejecución. Puede ser:
    *   Una instalación local directa (`mongod`).
    *   Un contenedor de Docker (ej. `docker run -d -p 27017:27017 mongo`).


## 2. Configuración del Entorno

1. En la raíz del proyecto, asegúrate de tener (o crear) un archivo llamado `.env`.
2. Define las siguientes variables de entorno básicas (ajustando la URI de Mongo según tu configuración):

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ifts29
```

## 3. Instalación de Dependencias

Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para descargar los módulos de Node necesarios:

```bash
npm install
```

## 4. Generación de Datos de Ejemplo (Seed) - *Opcional*

Si deseas tener datos listos para probar la API sin necesidad de cargarlos a mano uno por uno, puedes ejecutar el script generador de datos (esto limpiará la base y generará 3 registros para cada modelo):

```bash
npm run seed
```

## 5. Ejecutar la Aplicación

Para iniciar el servidor, dispones de dos comandos:

*   **Modo Producción/Normal:**
    ```bash
    npm start
    ```

*   **Modo Desarrollo (con Nodemon):**
    Este modo reiniciará automáticamente el servidor cada vez que guardes un cambio en el código.
    ```bash
    npm run dev
    ```

Una vez ejecutado, deberías ver en la consola los siguientes mensajes:
> MongoDB conectado
> Servidor corriendo en puerto 3000
