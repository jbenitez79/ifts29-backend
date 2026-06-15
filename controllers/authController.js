const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const mostrarLogin = (req, res) => {
    res.render('auth/login');
};

const mostrarRegister = (req, res) => {
    res.render('auth/register');
};

const loginUsuario = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.render('auth/login', {
                error: 'Usuario o contraseña incorrectos'
         });
        }

        // Comparar password
        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.render('auth/login', {
                error: 'Usuario o contraseña incorrectos'
            });
        }

        // Login exitoso
        // Generar JWT
        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol, email: usuario.email },
            process.env.JWT_SECRET || 'secreto_super_seguro_123',
            { expiresIn: '30m' } // Expiración de 30 minutos
        );

        // Guardar token en cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000 // 30 minutos en milisegundos
        });

        res.redirect('/index');
    } catch (error) {
        next(error);
    }
};

const logoutUsuario = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
};

const registrarUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si ya existe
        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
            return res.send('El usuario ya existe');
        }

        // Hash password
        const passwordHasheada = await bcrypt.hash(password, 10);

        // Validar rol
        const rolesValidos = ['admin', 'operador'];
        if (!rolesValidos.includes(rol)) {
            return res.send('Rol inválido');
        }

        // Crear usuario
        await Usuario.create({
            nombre,
            email,
            password: passwordHasheada,
            rol,
        });

        res.redirect('/login');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    mostrarLogin,
    mostrarRegister,
    registrarUsuario,
    loginUsuario,
    logoutUsuario,
};