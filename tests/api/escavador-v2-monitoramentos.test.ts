/**
 * @fileoverview Testes E2E para Escavador V2 — Monitoramentos
 * Cobertura: 10 endpoints (6 novos processos + 4 processos)
 * 3 testes por endpoint (30 total): sucesso, erro, sem resultado
 */

import { app } from '../../src/presentation/api/app';
import { rawStore } from '../../src/infrastructure/persistence/index';

describe('Escavador V2 — Monitoramentos (E2E)', () => {
  let saveSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    saveSpy = jest.spyOn(rawStore, 'save').mockImplementation(() => {});
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    saveSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: MONITORAMENTOS NOVOS PROCESSOS (6 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('GET /api/escavador/v2/monitoramentos/novos-processos', () => {
    it('✅ sucesso: retorna 200 com lista', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 1, variacao_busca: 'Empresa ABC', ativo: true }],
            total: 1,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos');

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

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('POST /api/escavador/v2/monitoramentos/novos-processos', () => {
    it('✅ sucesso: retorna 201 com novo monitoramento', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, variacao_busca: 'Empresa XYZ' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos', {
        method: 'POST',
        body: JSON.stringify({ variacao_busca: 'Empresa XYZ', tribunais: [1] }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(201);
    });

    it('❌ erro: retorna 422 com validação inválida', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos', {
        method: 'POST',
        body: JSON.stringify({ tribunais: [1] }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos', {
        method: 'POST',
        body: 'invalid',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/escavador/v2/monitoramentos/novos-processos/:id', () => {
    it('✅ sucesso: retorna 200 com detalhes', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, variacao_busca: 'Empresa ABC' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id).toBe(1);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/abc');

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/999');

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('PATCH /api/escavador/v2/monitoramentos/novos-processos/:id', () => {
    it('✅ sucesso: retorna 200 com edição', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, ativo: false }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/1', {
        method: 'PATCH',
        body: JSON.stringify({ ativo: false }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(200);
    });

    it('❌ erro: retorna 422 com callback_url inválida', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/1', {
        method: 'PATCH',
        body: JSON.stringify({ callback_url: 'not-a-url' }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/invalid', {
        method: 'PATCH',
        body: JSON.stringify({ ativo: true }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/escavador/v2/monitoramentos/novos-processos/:id', () => {
    it('✅ sucesso: retorna 204', async () => {
      fetchSpy.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/xyz', {
        method: 'DELETE',
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/999', {
        method: 'DELETE',
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/escavador/v2/monitoramentos/novos-processos/:id/resultados', () => {
    it('✅ sucesso: retorna 200 com processos encontrados', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ numero_cnj: '0000001-00.0000.0.00.0000' }],
            total: 1,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/1/resultados');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/invalid/resultados');

      expect(res.status).toBe(400);
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

      const res = await app.request('/api/escavador/v2/monitoramentos/novos-processos/1/resultados');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: MONITORAMENTOS PROCESSOS (4 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('GET /api/escavador/v2/monitoramentos/processos', () => {
    it('✅ sucesso: retorna 200 com lista', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 10, processo_id: 123, ativo: true }],
            total: 1,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/processos');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Server error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/processos');

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

      const res = await app.request('/api/escavador/v2/monitoramentos/processos');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('POST /api/escavador/v2/monitoramentos/processos', () => {
    it('✅ sucesso: retorna 201 com novo monitoramento', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 10, processo_id: 123 }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/processos', {
        method: 'POST',
        body: JSON.stringify({ processo_id: 123, callback_url: 'https://app.example.com' }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(201);
    });

    it('❌ erro: retorna 422 com processo_id ausente', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/processos', {
        method: 'POST',
        body: JSON.stringify({ callback_url: 'https://app.example.com' }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });

    it('⊘ sem resultado: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/processos', {
        method: 'POST',
        body: 'malformed {',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/escavador/v2/monitoramentos/processos/:id', () => {
    it('✅ sucesso: retorna 200 com detalhes', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 10, processo_id: 123 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/monitoramentos/processos/10');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id).toBe(10);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/processos/notanumber');

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando não encontrado', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/processos/999');

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('DELETE /api/escavador/v2/monitoramentos/processos/:id', () => {
    it('✅ sucesso: retorna 204', async () => {
      fetchSpy.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/processos/10', {
        method: 'DELETE',
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/monitoramentos/processos/invalid', {
        method: 'DELETE',
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando já foi removido', async () => {
      fetchSpy.mockResolvedValue(new Response('Not found', { status: 404 }));

      const res = await app.request('/api/escavador/v2/monitoramentos/processos/999', {
        method: 'DELETE',
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });
});
