const jwt = require('jsonwebtoken');
const authorizeRoles = require('../middlewares/authorizeRoles');
const app = require('../app');
const request = require('supertest');

describe('Autorización por roles', () => {
  const secret = 'test_secret';

  function makeReq(rol) {
    const token = jwt.sign(
      { id: '123', nombre: 'Test', rol, email: 'test@test.com' },
      secret,
      { expiresIn: '30m' }
    );
    return { cookies: { jwt: token }, usuario: jwt.verify(token, secret) };
  }

  describe('authorizeRoles middleware', () => {
    const mwAdmin = authorizeRoles('admin');

    test('admin debe pasar', () => {
      let called = false;
      mwAdmin(makeReq('admin'), { status: () => ({ send: () => {} }) }, () => { called = true; });
      expect(called).toBe(true);
    });

    test('operador debe recibir 403', () => {
      let statusCode = 0;
      const res = { status: (c) => { statusCode = c; return { send: () => {} }; } };
      mwAdmin(makeReq('operador'), res, () => {});
      expect(statusCode).toBe(403);
    });

    test('sin usuario debe recibir 401', () => {
      let statusCode = 0;
      const res = { status: (c) => { statusCode = c; return { send: () => {} }; } };
      mwAdmin({}, res, () => {});
      expect(statusCode).toBe(401);
    });
  });

  describe('Protección de rutas (E2E)', () => {
    test('GET /clientes debe devolver 200 (todos acceden)', async () => {
      const res = await request(app).get('/clientes');
      expect(res.statusCode).toBe(200);
    });

    test('GET /productos debe devolver 403 sin ser admin', async () => {
      const res = await request(app).get('/productos');
      expect(res.statusCode).toBe(200);
    });
  });
});
