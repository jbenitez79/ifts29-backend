const express = require('express');
const router = express.Router();

const {
  mostrarLogin,
  mostrarRegister,
  loginUsuario,
  registrarUsuario,

} = require('../controllers/authController');

router.get('/login', mostrarLogin);

router.get('/register', mostrarRegister);

router.post('/login', loginUsuario);

router.post('/register', registrarUsuario);

module.exports = router;