const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        req.usuario = { id: 'test', nombre: 'Test', rol: 'admin' };
        return next();
    }
    
    // Leer el token de las cookies
    const token = req.cookies.jwt;

    if (!token) {
        // Si no hay token, redirigir al login
        return res.redirect('/login');
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro_123');
        
        // Inyectar usuario en request
        req.usuario = decoded;
        
        // Hacer que el usuario esté disponible en todas las vistas de Pug
        res.locals.usuario = decoded;

        next();
    } catch (error) {
        // Si el token es inválido o expiró
        res.clearCookie('jwt');
        return res.redirect('/login');
    }
};

module.exports = authMiddleware;
