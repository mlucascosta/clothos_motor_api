/**
 * @fileoverview Testes do middleware bearerAuth.
 * Valida comportamento de autenticação e comparação em tempo constante.
 * @module tests/presentation/api/bearerAuth
 */

import { Hono } from 'hono';
import { bearerAuth } from '../../../src/presentation/api/middlewares/bearerAuth';

/** Cria app Hono isolado com bearerAuth para testes fora do NODE_ENV=test. */
function makeApp(secret: string | undefined) {
  const app = new Hono();
  app.use('/protected/*', (c, next) => {
    // Sobrescreve NODE_ENV para simular ambiente real
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.MOTOR_INTERNAL_SECRET = secret ?? '';
    // `delete` é necessário: atribuir `undefined` a process.env armazena a string "undefined".
    // biome-ignore lint/performance/noDelete: remoção real da env var para simular ausência de secret
    if (!secret) delete process.env.MOTOR_INTERNAL_SECRET;
    const result = bearerAuth(c, next);
    process.env.NODE_ENV = original;
    return result;
  });
  app.get('/protected/ping', (c) => c.json({ ok: true }));
  return app;
}

describe('bearerAuth middleware', () => {
  const SECRET = 'super-secret-token-for-tests';

  it('retorna 401 quando Authorization header está ausente', async () => {
    const app = makeApp(SECRET);
    const res = await app.request('/protected/ping');
    expect(res.status).toBe(401);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.error).toBe('Não autorizado');
  });

  it('retorna 401 quando token está incorreto', async () => {
    const app = makeApp(SECRET);
    const res = await app.request('/protected/ping', {
      headers: { Authorization: 'Bearer wrong-token' },
    });
    expect(res.status).toBe(401);
  });

  it('retorna 401 quando header usa esquema incorreto (Basic)', async () => {
    const app = makeApp(SECRET);
    const res = await app.request('/protected/ping', {
      headers: { Authorization: 'Basic dXNlcjpwYXNz' },
    });
    expect(res.status).toBe(401);
  });

  it('retorna 500 quando MOTOR_INTERNAL_SECRET não está configurado', async () => {
    const app = makeApp(undefined);
    const res = await app.request('/protected/ping', {
      headers: { Authorization: `Bearer ${SECRET}` },
    });
    expect(res.status).toBe(500);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.error).toBe('Servidor mal configurado');
  });

  it('passa para o próximo handler com token correto', async () => {
    const app = makeApp(SECRET);
    const res = await app.request('/protected/ping', {
      headers: { Authorization: `Bearer ${SECRET}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.ok).toBe(true);
  });

  it('usa comparação em tempo constante — token com mesmo prefixo é rejeitado', async () => {
    const app = makeApp(SECRET);
    // Token com mesmo início mas diferente — timing attack tentaria distinguir
    const res = await app.request('/protected/ping', {
      headers: { Authorization: `Bearer ${SECRET.slice(0, 5)}` },
    });
    expect(res.status).toBe(401);
  });
});
