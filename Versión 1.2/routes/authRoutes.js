const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

const {
  mostrarLogin,
  mostrarRegister,
  loginUsuario,
  registrarUsuario,
  logoutUsuario,
} = require('../controllers/authController');

router.get('/login', mostrarLogin);

router.get('/register', authMiddleware, authorizeRoles('admin'), mostrarRegister);

router.post('/login', loginUsuario);

router.post('/register', authMiddleware, authorizeRoles('admin'), registrarUsuario);

router.get('/logout', logoutUsuario);

module.exports = router;