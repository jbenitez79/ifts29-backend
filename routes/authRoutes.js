const express = require('express');
const router = express.Router();

const {
  mostrarLogin,
  mostrarRegister,
  loginUsuario,
  registrarUsuario,
  logoutUsuario,
} = require('../controllers/authController');

router.get('/login', mostrarLogin);

router.get('/register', mostrarRegister);

router.post('/login', loginUsuario);

router.post('/register', registrarUsuario);

router.get('/logout', logoutUsuario);

module.exports = router;