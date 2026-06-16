const authorizeRoles = (...rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).send("No autenticado");
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).send("Acceso denegado");
        }

        next();
    };
};

module.exports = authorizeRoles;