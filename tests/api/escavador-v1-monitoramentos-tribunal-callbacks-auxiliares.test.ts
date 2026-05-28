/**
 * @fileoverview Testes E2E para Escavador V1 — Monitoramentos Tribunal, Callbacks, Auxiliares
 * Cobertura: 12 endpoints (5 tribunal + 3 callbacks + 4 auxiliares)
 * 3 testes por endpoint (36 total): sucesso, erro, sem resultado
 */

import { app } from '../../../src/presentation/api/app';

describe('Escavador V1 — Monitoramentos Tribunal, Callbacks, Auxiliares (E2E)', () => {
  let fetchSpy: jest.SpyInstance;
  const headers = { Authorization: 'Bearer test-token' };

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('GET /api/escavador/v1/monitoramentos/tribunal', () => {
    it('✅ sucesso: retorna 200 com lista', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, tribunal: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal', { headers });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com dados vazios', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ data: [], pagination: { page: 1, total: 0 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal', { headers });

      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/escavador/v1/monitoramentos/tribunal', () => {
    it('✅ sucesso: retorna 201', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, tribunal: 1 }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal', {
        method: 'POST',
        body: JSON.stringify({ tipo: 'cpf', identificador: '12345678901', tribunal: 1 }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(201);
    });

    it('❌ erro: retorna 422 com validação inválida', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal', {
        method: 'POST',
        body: JSON.stringify({ tribunal: 1 }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal', {
        method: 'POST',
        body: JSON.stringify({ tipo: 'cpf', identificador: '12345678901', tribunal: 1 }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/escavador/v1/monitoramentos/tribunal/:id', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, tribunal: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/1', { headers });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/abc', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/999', { headers });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('PUT /api/escavador/v1/monitoramentos/tribunal/:id', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, ativo: false }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/1', {
        method: 'PUT',
        body: JSON.stringify({ ativo: false }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/invalid', {
        method: 'PUT',
        body: JSON.stringify({ ativo: false }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/1', {
        method: 'PUT',
        body: JSON.stringify({ ativo: false }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/escavador/v1/monitoramentos/tribunal/:id', () => {
    it('✅ sucesso: retorna 204', async () => {
      fetchSpy.mockResolvedValue(new Response(null, { status: 204 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/abc', {
        method: 'DELETE',
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/tribunal/999', {
        method: 'DELETE',
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/escavador/v1/callbacks', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [{ id: 1, status: 'pending' }],
            pagination: { page: 1, total: 1 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/callbacks', { headers });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/callbacks', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [],
            pagination: { page: 1, total: 0 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/callbacks', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.data as Array<unknown>).length).toBe(0);
    });
  });

  describe('POST /api/escavador/v1/callbacks/marcar-recebidos', () => {
    it('✅ sucesso: retorna 204', async () => {
      fetchSpy.mockResolvedValue(new Response(null, { status: 204 }));

      const res = await app.request('/api/escavador/v1/callbacks/marcar-recebidos', {
        method: 'POST',
        body: JSON.stringify({ ids: [1, 2, 3] }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: retorna 422 com ids vazio', async () => {
      const res = await app.request('/api/escavador/v1/callbacks/marcar-recebidos', {
        method: 'POST',
        body: JSON.stringify({ ids: [] }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/callbacks/marcar-recebidos', {
        method: 'POST',
        body: JSON.stringify({ ids: [1, 2] }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/escavador/v1/callbacks/:id/reenviar', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ status: 'reenviado' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/callbacks/1/reenviar', {
        method: 'POST',
      });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/callbacks/abc/reenviar', {
        method: 'POST',
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/callbacks/999/reenviar', {
        method: 'POST',
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/escavador/v1/tribunais', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [{ id: 1, nome: 'TJ SP' }],
            pagination: { page: 1, total: 1 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/tribunais', { headers });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/tribunais', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [],
            pagination: { page: 1, total: 0 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/tribunais', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.data as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v1/tribunais/:id', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, nome: 'TJ SP' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/tribunais/1', { headers });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/tribunais/abc', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/tribunais/999', { headers });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/escavador/v1/orgaos-administrativos', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [{ id: 1, nome: 'Ministério da Justiça' }],
            pagination: { page: 1, total: 1 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/orgaos-administrativos', { headers });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/orgaos-administrativos', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [],
            pagination: { page: 1, total: 0 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/orgaos-administrativos', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.data as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v1/diarios-oficiais/origens', () => {
    it('✅ sucesso: retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [{ id: 1, nome: 'DOU' }],
            pagination: { page: 1, total: 1 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/diarios-oficiais/origens', { headers });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/diarios-oficiais/origens', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [],
            pagination: { page: 1, total: 0 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/diarios-oficiais/origens', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.data as Array<unknown>).length).toBe(0);
    });
  });
});
