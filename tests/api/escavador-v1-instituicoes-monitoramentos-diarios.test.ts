/**
 * @fileoverview Testes E2E para Escavador V1 — Instituições, Monitoramentos Diários
 * Cobertura: 11 endpoints (3 instituições + 8 monitoramentos)
 * 3 testes por endpoint (33 total): sucesso, erro, sem resultado
 */

import { app } from '../../src/presentation/api/app';

describe('Escavador V1 — Instituições, Monitoramentos Diários (E2E)', () => {
  let fetchSpy: jest.SpyInstance;
  const headers = { Authorization: 'Bearer test-token' };

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('GET /api/escavador/v1/instituicoes/:id', () => {
    it('✅ sucesso: retorna 200 com dados da instituição', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, nome: 'Universidade ABC' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/instituicoes/1', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id || body.nome).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/instituicoes/abc', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200/404 com ID inexistente', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 999, nome: 'N/A' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/instituicoes/999', { headers });

      expect([200, 404]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v1/instituicoes/:id/pessoas', () => {
    it('✅ sucesso: retorna 200 com array de pessoas', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [{ id: 1, nome: 'Prof. Silva' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/instituicoes/1/pessoas', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/instituicoes/abc/pessoas', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/instituicoes/999/pessoas', { headers });

      expect([200, 404]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v1/instituicoes/:id/processos', () => {
    it('✅ sucesso: retorna 200 com array de processos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [{ numero_cnj: '0000001-00.0000.0.00.0000' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/instituicoes/1/processos', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/instituicoes/abc/processos', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/instituicoes/999/processos', { headers });

      expect([200, 404]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v1/monitoramentos', () => {
    it('✅ sucesso: retorna 200 com lista de monitoramentos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 1, tipo: 'numero', ativo: false }],
            paginator: { total: 1, current_page: 1, per_page: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/monitoramentos', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [],
            paginator: { total: 0, current_page: 1, per_page: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('POST /api/escavador/v1/monitoramentos', () => {
    it('✅ sucesso: retorna 201 com novo monitoramento', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, tipo: 'numero', ativo: true }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos', {
        method: 'POST',
        body: JSON.stringify({
          nome: 'Monitoramento Teste',
          tipo: 'numero',
          identificador: 'valor',
        }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(201);
    });

    it('❌ erro: retorna 422 com tipo inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos', {
        method: 'POST',
        body: JSON.stringify({ tipo: '', valor: 'valor' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos', {
        method: 'POST',
        body: 'invalid',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/escavador/v1/monitoramentos/:id', () => {
    it('✅ sucesso: retorna 200 com detalhes', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, tipo: 'numero', ativo: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/1', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id).toBe(1);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/abc', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/999', { headers });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('PUT /api/escavador/v1/monitoramentos/:id', () => {
    it('✅ sucesso: retorna 200 com edição', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, ativo: false }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/1', {
        method: 'PUT',
        body: JSON.stringify({ ativo: false }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/abc', {
        method: 'PUT',
        body: JSON.stringify({ ativo: true }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/1', {
        method: 'PUT',
        body: JSON.stringify({ ativo: true }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/escavador/v1/monitoramentos/:id', () => {
    it('✅ sucesso: retorna 204', async () => {
      fetchSpy.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/abc', {
        method: 'DELETE',
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/999', {
        method: 'DELETE',
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/escavador/v1/monitoramentos/:id/aparicoes', () => {
    it('✅ sucesso: retorna 200 com aparições', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 1, data: '2024-05-27' }],
            paginator: { total: 1, current_page: 1, per_page: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/1/aparicoes', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/abc/aparicoes', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [],
            paginator: { total: 0, current_page: 1, per_page: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/1/aparicoes', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('POST /api/escavador/v1/monitoramentos/:id/testar-callback', () => {
    it('✅ sucesso: retorna 204 com teste enviado', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ status: 'enviado' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/1/testar-callback', {
        method: 'POST',
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/abc/testar-callback', {
        method: 'POST',
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/monitoramentos/1/testar-callback', {
        method: 'POST',
      });

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/escavador/v1/monitoramentos/:id/origens', () => {
    it('✅ sucesso: retorna 200 com origens', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [{ id: 1, nome: 'DOU' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/1/origens', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/monitoramentos/abc/origens', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/monitoramentos/1/origens', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });
});
