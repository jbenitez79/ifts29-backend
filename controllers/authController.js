const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const mostrarLogin = (req, res) => {
    res.render('auth/login');
};

const mostrarRegister = (req, res) => {
    res.render('auth/register');
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.send('Usuario o contraseña incorrectos');
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
        res.redirect('/index');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al iniciar sesión');
    }
};

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si ya existe
        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
            return res.send('El usuario ya existe');
        }

        // Hash password
        const passwordHasheada = await bcrypt.hash(password, 10);

        // Crear usuario
        await Usuario.create({
            nombre,
            email,
            password: passwordHasheada,
        });

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};

module.exports = {
    mostrarLogin,
    mostrarRegister,
    registrarUsuario,
    loginUsuario,
};