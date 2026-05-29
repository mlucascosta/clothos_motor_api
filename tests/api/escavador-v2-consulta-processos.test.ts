/**
 * @fileoverview Testes E2E para Escavador V2 — Consulta de Processos
 * Cobertura: 9 endpoints
 * 3 testes por endpoint (27 total): sucesso, erro, sem resultado
 */

import { app } from '../../src/presentation/api/app';

describe('Escavador V2 — Consulta de Processos (E2E)', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('GET /api/escavador/v2/processos/numero_cnj/:numero', () => {
    it('✅ sucesso: retorna 200 com detalhes do processo', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            numero_cnj: '0000001-00.0000.0.00.0000',
            id: 1,
            titulo_polo_ativo: 'Autor',
            titulo_polo_passivo: 'Réu',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/numero_cnj/0000001-00.0000.0.00.0000');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.numero_cnj).toBe('0000001-00.0000.0.00.0000');
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/processos/numero_cnj/0000001-00.0000.0.00.0000');

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com objeto vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ numero_cnj: '', id: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/processos/numero_cnj/9999999-99.9999.9.99.9999');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/escavador/v2/processos/movimentacoes/:numero_cnj', () => {
    it('✅ sucesso: retorna 200 com array de movimentações', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 1, tipo: 'Sentença' }],
            total: 1,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

        const res = await app.request('/api/escavador/v2/processos/movimentacoes/0000001-00.0000.0.00.0000?page=1');

        expect(res.status).toBe(200);
        const body = (await res.json()) as Record<string, unknown>;
        expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando API upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Gateway Timeout', { status: 504 }));

      const res = await app.request('/api/escavador/v2/processos/movimentacoes/0000001-00.0000.0.00.0000?page=1');

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [],
            total: 0,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/movimentacoes/0000001-00.0000.0.00.0000?page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v2/envolvido/processos', () => {
    it('✅ sucesso: retorna 200 com processos por envolvido', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            envolvido_encontrado: { nome: 'João Silva', tipo_pessoa: 'FISICA', quantidade_processos: 1 },
            items: [{ numero_cnj: '0000001-00.0000.0.00.0000', ano_inicio: 2020 }],
            paginator: { per_page: 20, current_page: 1, total: 1 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/envolvido/processos?nome=João%20Silva&page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 401 quando autenticação falha', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }),
      );

      const res = await app.request('/api/escavador/v2/envolvido/processos?nome=João&page=1');

      expect(res.status).toBe(401);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            envolvido_encontrado: { nome: '', tipo_pessoa: 'FISICA', quantidade_processos: 0 },
            items: [],
            paginator: { per_page: 20, current_page: 1, total: 0 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/envolvido/processos?cpf_cnpj=999.999.999-99&page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v2/envolvido/resumo', () => {
    it('✅ sucesso: retorna 200 com resumo estatístico', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total_processos: 12,
            por_tipo: { cível: 8, trabalhista: 3, criminal: 1 },
            por_status: { ativo: 10, finalizado: 2 },
            valor_total_disputa: 5500000.5,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/envolvido/resumo?nome=Empresa%20Ltda');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.total_processos).toBe(12);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Service Unavailable', { status: 503 }));

      const res = await app.request('/api/escavador/v2/envolvido/resumo?cpf_cnpj=11.222.333/0001-81');

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com zeros', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total_processos: 0,
            por_tipo: {},
            por_status: {},
            valor_total_disputa: 0,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/envolvido/resumo?nome=Inexistente');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.total_processos).toBe(0);
    });
  });

  describe('GET /api/escavador/v2/processos/advogado', () => {
    it('✅ sucesso: retorna 200 com processos de advogado', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 1,
            items: [{ numero_cnj: '0000001-00.0000.0.00.0000', atuacao: 'Réu' }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/advogado?oab_numero=123456&oab_estado=SP&page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 400 quando oab_numero ausente', async () => {
      const res = await app.request('/api/escavador/v2/processos/advogado?page=1');

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 0,
            items: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/advogado?oab_numero=999999&oab_estado=XX&page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v2/processos/advogado/resumo', () => {
    it('✅ sucesso: retorna 200 com resumo estatístico', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total_processos: 87,
            por_tipo: { cível: 65, trabalhista: 15, criminal: 7 },
            tribunais_principais: ['TJ/SP', 'STF', 'TST'],
            valor_total: 12500000.75,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/advogado/resumo?oab_numero=123456&oab_estado=SP');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.total_processos).toBe(87);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/processos/advogado/resumo?oab_numero=123456&oab_estado=SP');

      expect(res.status).toBe(500);
    });

    it('❌ erro: retorna 400 quando oab_numero ausente', async () => {
      const res = await app.request('/api/escavador/v2/processos/advogado/resumo');

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/escavador/v2/processos/:numero_cnj/documentos', () => {
    it('✅ sucesso: retorna 200 com lista de documentos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 1,
            items: [{ id: 1, tipo: 'Sentença', tamanho_kb: 245 }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/documentos?page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando API upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Bad Gateway', { status: 502 }));

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/documentos?page=1');

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 0,
            items: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/documentos?page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v2/processos/:numero_cnj/autos', () => {
    it('✅ sucesso: retorna 200 com lista de autos', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 1,
            items: [{ id: 1, nome: '001', tipo: 'Auto' }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/autos?page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Service Unavailable', { status: 503 }));

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/autos?page=1');

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 0,
            items: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/autos?page=1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v2/processos/:numero_cnj/envolvidos', () => {
    it('✅ sucesso: retorna 200 com partes envolvidas', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 1,
            items: [{ id: 1, tipo: 'Autor', nome: 'João Silva' }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/envolvidos');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando API upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Gateway Timeout', { status: 504 }));

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/envolvidos');

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 200 com arrays vazios', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            total: 0,
            items: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/envolvidos');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });
});
