const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Usuario = require('../models/Usuario');

const testUser = {
  nombre: 'Test Auth',
  email: 'test-auth@test.com',
  password: 'password123',
  rol: 'admin'
};

const newUser = {
  nombre: 'Nuevo Test',
  email: 'nuevo-test-auth@test.com',
  password: 'password456',
  rol: 'operador'
};

const emailsToDelete = [testUser.email, newUser.email];

beforeAll(async () => {
  const hash = await bcrypt.hash(testUser.password, 10);
  await Usuario.create({ ...testUser, password: hash });
});

afterAll(async () => {
  await Usuario.deleteMany({ email: { $in: emailsToDelete } });
  await mongoose.connection.close();
});

describe('Autenticación - Login / Logout', () => {
  describe('GET /login', () => {
    it('debe devolver la página de login', async () => {
      const res = await request(app).get('/login');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /login - credenciales válidas', () => {
    it('debe redirigir a /index y setear cookie JWT', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(302);

      expect(res.headers.location).toBe('/index');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const jwtCookie = cookies.find(c => c.startsWith('jwt='));
      expect(jwtCookie).toBeDefined();

      const token = jwtCookie.split(';')[0].split('=')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro_123');
      expect(decoded.email).toBe(testUser.email);
      expect(decoded.rol).toBe(testUser.rol);
    });
  });

  describe('POST /login - credenciales inválidas', () => {
    it('debe rechazar password incorrecto', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Usuario o contraseña incorrectos');
    });

    it('debe rechazar email inexistente', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'noexiste@test.com', password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Usuario o contraseña incorrectos');
    });
  });

  describe('GET /logout', () => {
    it('debe limpiar cookie y redirigir a /login', async () => {
      const res = await request(app).get('/logout').expect(302);
      expect(res.headers.location).toBe('/login');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const jwtCookie = cookies.find(c => c.startsWith('jwt='));
      expect(jwtCookie).toBeDefined();
      expect(jwtCookie).toContain('Expires=Thu, 01 Jan 1970');
    });
  });
});

describe('Autenticación - Register (con sesión admin)', () => {
  describe('POST /register - creación exitosa', () => {
    it('debe crear usuario y redirigir a /login', async () => {
      const res = await request(app)
        .post('/register')
        .send(newUser)
        .expect(302);

      expect(res.headers.location).toBe('/login');

      const usuario = await Usuario.findOne({ email: newUser.email });
      expect(usuario).not.toBeNull();
      expect(usuario.nombre).toBe(newUser.nombre);
      expect(usuario.rol).toBe(newUser.rol);
    });
  });

  describe('POST /register - email duplicado', () => {
    it('debe rechazar email ya registrado', async () => {
      const res = await request(app)
        .post('/register')
        .send(newUser);

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('ya existe');
    });
  });

  describe('POST /register - rol inválido', () => {
    it('debe rechazar rol no válido', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          nombre: 'Rol Invalido',
          email: 'rol-invalido@test.com',
          password: 'password789',
          rol: 'superadmin'
        });

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Rol inválido');
    });
  });
});
