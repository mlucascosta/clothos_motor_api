/**
 * @fileoverview Testes E2E para Escavador V1 — Saldo, Buscas, Processos
 * Cobertura: 9 endpoints (1 saldo + 2 buscas + 6 processos)
 * 3 testes por endpoint (27 total): sucesso, erro, sem resultado
 */

import { app } from '../../src/presentation/api/app';

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
        new Response(
          JSON.stringify({
            quantidade_creditos: 1000,
            saldo: 1000.0,
            saldo_descricao: 'R$ 1.000,00',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      const res = await app.request('/api/escavador/v1/quantidade-creditos', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.saldo).toBe(1000);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v1/quantidade-creditos', { headers });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com saldo zero', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ quantidade_creditos: 0, saldo: 0.0 }), {
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
            items: [{ id: 1, status: 'concluido', tipo: 'cpf' }],
            paginator: { total: 1, total_pages: 1, current_page: 1, per_page: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/buscas-assincronas', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
      expect(Array.isArray(body.items)).toBe(true);
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
            items: [],
            paginator: { total: 0, total_pages: 0, current_page: 1, per_page: 20 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/buscas-assincronas', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
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
        new Response(JSON.stringify({ items: [{ id: 1, status: 'pendente' }] }), {
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
        new Response(JSON.stringify({ items: [{ id: 2, status: 'pendente' }] }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/tribunal/oab', {
        method: 'POST',
        body: JSON.stringify({ numero_oab: '123456', estado_oab: 'SP' }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com OAB inválida', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/oab', {
        method: 'POST',
        body: JSON.stringify({ numero_oab: '', estado_oab: '' }),
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
        new Response(JSON.stringify({ id: 3, status: 'pending' }), {
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
        new Response(JSON.stringify({ id: 4, status: 'pending' }), {
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
        new Response(JSON.stringify({ items: [{ id: 5, status: 'pendente' }] }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/tribunal/lote', {
        method: 'POST',
        body: JSON.stringify({
          tipo: 'busca_por_documento',
          tribunais: ['tjsp'],
          numero_documento: '12345678901',
        }),
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
    });

    it('❌ erro: retorna 422 com body incompleto', async () => {
      const res = await app.request('/api/escavador/v1/processos/tribunal/lote', {
        method: 'POST',
        body: JSON.stringify({ tipo: 'busca_por_documento' }),
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
        new Response(JSON.stringify({ items: [{ id: 6, status: 'pendente' }] }), {
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
