/**
 * @fileoverview Testes E2E para Escavador V1 — Diários, Detalhes, Pessoas
 * Cobertura: 10 endpoints
 * 3 testes por endpoint (30 total): sucesso, erro, sem resultado
 */

import { app } from '../../src/presentation/api/app';

describe('Escavador V1 — Diários, Detalhes, Pessoas (E2E)', () => {
  let fetchSpy: jest.SpyInstance;
  const headers = { Authorization: 'Bearer test-token' };

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('GET /api/escavador/v1/processos/diarios-oficiais/numero', () => {
    it('✅ sucesso: retorna 200 com array de processos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({ items: [{ id: 1, nome: 'Processo 1' }], total: 1 }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/processos/diarios-oficiais/numero?numero=0000001-00.0000.0.00.0000', {
        headers,
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 sem parâmetro numero', async () => {
      const res = await app.request('/api/escavador/v1/processos/diarios-oficiais/numero', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/diarios-oficiais/numero?numero=9999999-99.9999.9.99.9999', {
        headers,
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items) && body.items.length === 0).toBe(true);
    });
  });

  describe('GET /api/escavador/v1/processos/diarios-oficiais/oab', () => {
    it('✅ sucesso: retorna 200 com array de processos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({ items: [{ id: 1, nome: 'Processo 1' }], total: 1 }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/processos/diarios-oficiais/oab?oab=123456SP', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 sem parâmetro oab', async () => {
      const res = await app.request('/api/escavador/v1/processos/diarios-oficiais/oab', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/diarios-oficiais/oab?oab=999999ZZ', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items) && body.items.length === 0).toBe(true);
    });
  });

  describe('GET /api/escavador/v1/processos/:numero_cnj', () => {
    it('✅ sucesso: retorna 200 com detalhes do processo', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            numero: '0000001-00.0000.0.00.0000',
            status: 'Ativo',
            tribunal: 'TJ/SP',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/processos/0000001-00.0000.0.00.0000', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.numero || body.numero_cnj || body.id).toBeDefined();
    });

    it('❌ erro: retorna 404/500 quando processo não existe', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/processos/9999999-99.9999.9.99.9999', { headers });

      expect([404, 500]).toContain(res.status);
    });

    it('⊘ sem resultado: retorna 200 com objeto vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/0000000-00.0000.0.00.0000', { headers });

      expect([200, 404]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v1/processos/:numero_cnj/movimentacoes', () => {
    it('✅ sucesso: retorna 200 com movimentações', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 1, tipo: 'Sentença', data: '2024-05-20', descricao: 'Movimentação inicial' }],
            paginator: { total: 1, current_page: 1, per_page: 20 },
            total: 1,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/processos/0000001-00.0000.0.00.0000/movimentacoes?page=1', {
        headers,
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400/500 com numero_cnj inválido', async () => {
      fetchSpy.mockResolvedValue(new Response('Invalid', { status: 400 }));

      const res = await app.request('/api/escavador/v1/processos/invalido/movimentacoes?page=1', { headers });

      expect([400, 404, 500]).toContain(res.status);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/9999999-99.9999.9.99.9999/movimentacoes?page=1', {
        headers,
      });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/escavador/v1/processos/:id/envolvidos-diarios', () => {
    it('✅ sucesso: retorna 200 com envolvidos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({ items: [{ id: 1, nome: 'João Silva' }], total: 1 }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/processos/123/envolvidos-diarios', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID não numérico', async () => {
      const res = await app.request('/api/escavador/v1/processos/abc/envolvidos-diarios', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/processos/999999/envolvidos-diarios', { headers });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/escavador/v1/movimentacoes/:id', () => {
    it('✅ sucesso: retorna 200 com detalhes da movimentação', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1001, tipo: 'Sentença', data: '2024-05-20' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/movimentacoes/1001', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id || body.tipo || body.data).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID não numérico', async () => {
      const res = await app.request('/api/escavador/v1/movimentacoes/abc', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200/500 com ID inexistente', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/movimentacoes/999999', { headers });

      expect([200, 404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v1/busca', () => {
    it('✅ sucesso: retorna 200 com resultados', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({ items: [{ id: 1, nome: 'Silva' }], total: 1 }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/busca?q=silva&page=1', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 sem parâmetro q', async () => {
      const res = await app.request('/api/escavador/v1/busca?page=1', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/busca?q=zzzzzzzzzzzzzzzzz&page=1', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items) && body.items.length === 0).toBe(true);
    });
  });

  describe('GET /api/escavador/v1/pessoas/:id', () => {
    it('✅ sucesso: retorna 200 com dados da pessoa', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1001, nome: 'João Silva', cpf: 'XXX.XXX.XXX-XX' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/pessoas/1001', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id || body.nome || body.cpf || body.cnpj).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID não numérico', async () => {
      const res = await app.request('/api/escavador/v1/pessoas/abc', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200/500 com ID inexistente', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v1/pessoas/999999', { headers });

      expect([200, 404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v1/pessoas/:id/processos', () => {
    it('✅ sucesso: retorna 200 com array de processos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ numero_cnj: '0000001-00.0000.0.00.0000' }],
            paginator: { total: 1, current_page: 1, per_page: 20 },
            total: 1,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/pessoas/1001/processos?page=1', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID não numérico', async () => {
      const res = await app.request('/api/escavador/v1/pessoas/abc/processos?page=1', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/pessoas/999999/processos?page=1', { headers });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/escavador/v1/pessoas/:id/publicacoes', () => {
    it('✅ sucesso: retorna 200 com array de publicações', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 1, data_publicacao: '2024-01-15', diario: 'DOU', conteudo: 'Conteúdo da publicação' }],
            paginator: { total: 1, current_page: 1, per_page: 20 },
            total: 1,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v1/pessoas/1001/publicacoes?page=1', { headers });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.items).toBeDefined();
    });

    it('❌ erro: retorna 400 com ID não numérico', async () => {
      const res = await app.request('/api/escavador/v1/pessoas/abc/publicacoes?page=1', { headers });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v1/pessoas/999999/publicacoes?page=1', { headers });

      expect(res.status).toBe(200);
    });
  });
});
