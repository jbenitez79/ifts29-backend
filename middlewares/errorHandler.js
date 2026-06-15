const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Identificar el código de estado, por defecto 500
    const statusCode = err.statusCode || 500;
    
    // Identificar el mensaje de error
    let message = err.message || 'Error interno del servidor';

    // Manejo de errores específicos de Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Valor duplicado detectado para un campo único.';
    }

    // Si es una petición a la API (JSON)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(statusCode).json({
            success: false,
            error: message
        });
    }

    // Si es una petición tradicional (HTML/Pug)
    // Se asume que existe una vista de error genérica 'error' o se envía un mensaje de texto
    res.status(statusCode).send(`<h1>Error ${statusCode}</h1><p>${message}</p><a href="/index">Volver al inicio</a>`);
};

module.exports = errorHandler;
