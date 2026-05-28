/**
 * @fileoverview Testes E2E para Escavador V1 — Saldo, Buscas, Processos
 * Cobertura: 9 endpoints (1 saldo + 2 buscas + 6 processos)
 * 3 testes por endpoint (27 total): sucesso, erro, sem resultado
 */

import { app } from '../../../src/presentation/api/app';

describe('Escavador V1 — Saldo, Buscas, Processos (E2E)', () => {
  let fetchSpy: jest.SpyInstance;
  const headers = { Authorization: 'Bearer test-token' };

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('GET /api/escavador/v1/quantidade-creditos', () => {
    it('✅ sucesso: retorna 200 com saldo de créditos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ saldo: 1000, moeda: 'BRL' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/quantidade-creditos', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('saldo');
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/quantidade-creditos', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com saldo zero', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ saldo: 0, moeda: 'BRL' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/quantidade-creditos', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.saldo).toBe(0);
    });
  });

  describe('GET /api/escavador/v1/buscas-assincronas', () => {
    it('✅ sucesso: retorna 200 com lista de buscas', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [{ id: 1, status: 'completed', created_at: '2024-05-27T10:00:00Z' }],
            pagination: { page: 1, total: 1, por_pagina: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/buscas-assincronas', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/buscas-assincronas', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [],
            pagination: { page: 1, total: 0, por_pagina: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/buscas-assincronas', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.data as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v1/buscas-assincronas/:id', () => {
    it('✅ sucesso: retorna 200 com detalhes da busca', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, status: 'completed', resultado_count: 5 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/buscas-assincronas/1', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id).toBe(1);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v1/buscas-assincronas/abc', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando ID não existe', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/buscas-assincronas/999', { headers });

      expect([404, 500]).toContain(res.status);
    });
  });

  describe('POST /api/escavador/v1/processos/tribunal/cpf-cnpj', () => {
    it('✅ sucesso: retorna 202 com busca iniciada', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 'search-1', status: 'pending' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/tribunal/cpf-cnpj', {
        method: 'POST',
        body: JSON.stringify({ cpf_cnpj: '12345678901' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com cpf_cnpj inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/cpf-cnpj', {
        method: 'POST',
        body: JSON.stringify({ cpf_cnpj: '' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/cpf-cnpj', {
        method: 'POST',
        body: 'invalid',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/escavador/v1/processos/tribunal/oab', () => {
    it('✅ sucesso: retorna 202 com busca por OAB', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 'search-2', status: 'pending' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/tribunal/oab', {
        method: 'POST',
        body: JSON.stringify({ oab: '123456SP' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com OAB inválida', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/oab', {
        method: 'POST',
        body: JSON.stringify({ oab: '' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/oab', {
        method: 'POST',
        body: 'invalid',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/escavador/v1/processos/administrativo/nup', () => {
    it('✅ sucesso: retorna 202 com busca por NUP', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 'search-3', status: 'pending' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/administrativo/nup', {
        method: 'POST',
        body: JSON.stringify({ nup: '00000000000000000001' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com NUP inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/administrativo/nup', {
        method: 'POST',
        body: JSON.stringify({ nup: '' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/administrativo/nup', {
        method: 'POST',
        body: 'invalid',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/escavador/v1/processos/pesquisar', () => {
    it('✅ sucesso: retorna 202 com busca por CNJ', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 'search-4', status: 'pending' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/pesquisar', {
        method: 'POST',
        body: JSON.stringify({ numero_cnj: '0000001-00.0000.0.00.0000' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com numero_cnj inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/pesquisar', {
        method: 'POST',
        body: JSON.stringify({ numero_cnj: '' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/pesquisar', {
        method: 'POST',
        body: 'invalid',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/escavador/v1/processos/tribunal/lote', () => {
    it('✅ sucesso: retorna 202 com busca em lote', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 'lote-1', status: 'pending', total: 3 }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/tribunal/lote', {
        method: 'POST',
        body: JSON.stringify({
          processos: [
            { numero_cnj: '0000001-00.0000.0.00.0000' },
            { numero_cnj: '0000002-00.0000.0.00.0000' },
          ],
        }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com array vazio', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/lote', {
        method: 'POST',
        body: JSON.stringify({ processos: [] }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/lote', {
        method: 'POST',
        body: 'invalid',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/escavador/v1/processos/tribunal/envolvido', () => {
    it('✅ sucesso: retorna 202 com busca por envolvido', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 'search-env', status: 'pending' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/tribunal/envolvido', {
        method: 'POST',
        body: JSON.stringify({ nome: 'João Silva' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com nome vazio', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/envolvido', {
        method: 'POST',
        body: JSON.stringify({ nome: '' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/envolvido', {
        method: 'POST',
        body: 'invalid',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });
});
