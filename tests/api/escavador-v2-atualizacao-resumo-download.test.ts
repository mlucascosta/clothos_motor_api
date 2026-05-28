/**
 * @fileoverview Testes end-to-end (e2e) para Escavador V2 — Atualização, Resumo, Download
 * Cobertura: 8 endpoints (4 atualização + 3 resumo + 1 download)
 * 3 testes por endpoint (24 total): sucesso, erro, sem resultado
 */

import { app } from '../../src/presentation/api/app';

describe('Escavador V2 — Atualização, Resumo, Download (E2E)', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: ATUALIZAÇÃO DE PROCESSOS (4 endpoints, 3 testes cada)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('POST /api/escavador/v2/processos/atualizacao', () => {
    it('✅ sucesso: retorna 202 com status pending', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, status: 'pendente' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/processos/atualizacao', {
        method: 'POST',
        body: JSON.stringify({
          processos: [{ numero_cnj: '0000001-00.0000.0.00.0000' }],
          enviar_callback: false,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(202);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('status');
    });

    it('❌ erro: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v2/processos/atualizacao', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 422 com array vazio', async () => {
      const res = await app.request('/api/escavador/v2/processos/atualizacao', {
        method: 'POST',
        body: JSON.stringify({ processos: [] }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/escavador/v2/processos/atualizacao/:id', () => {
    it('✅ sucesso: retorna 200 com status do lote', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, status: 'concluido', processados: 2 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/processos/atualizacao/1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('status');
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/processos/atualizacao/invalid');

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando ID não existe', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/processos/atualizacao/999999');

      expect([500, 404]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v2/processos/:id/atualizacao', () => {
    it('✅ sucesso: retorna 200 com status de atualização', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, status: 'concluido' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/atualizacao');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('status');
    });

    it('❌ erro: retorna 500 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/processos/invalid/atualizacao');

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 500 quando processo não existe', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/processos/9999999-99.9999.9.99.9999/atualizacao');

      expect([500, 404]).toContain(res.status);
    });
  });

  describe('POST /api/escavador/v2/processos/:id/atualizacao', () => {
    it('✅ sucesso: retorna 202 com job_id', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, status: 'pendente' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/processos/0000001-00.0000.0.00.0000/atualizacao', {
        method: 'POST',
      });

      expect(res.status).toBe(202);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('id');
    });

    it('❌ erro: retorna 500 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/processos/invalid/atualizacao', {
        method: 'POST',
      });

      expect(res.status).toBe(500);
    });

    it('⊘ sem resultado: retorna 500 quando processo não existe', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/processos/9999999-99.9999.9.99.9999/atualizacao', {
        method: 'POST',
      });

      expect([500, 404]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: RESUMO DE PROCESSOS (3 endpoints, 3 testes cada)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('POST /api/escavador/v2/processos/:id/resumo', () => {
    it('✅ sucesso: retorna 202 com job_id', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ id: 1, status: 'pendente' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/processos/123/resumo', {
        method: 'POST',
      });

      expect(res.status).toBe(202);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('id');
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/processos/invalid/resumo', {
        method: 'POST',
      });

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando processo não existe', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/processos/999999/resumo', {
        method: 'POST',
      });

      expect([500, 404]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v2/processos/:id/resumo', () => {
    it('✅ sucesso: retorna 200 com resumo gerado', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            status: 'concluido',
            resumo: 'Ação judicial sobre cobrança de débito...',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/123/resumo');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('resumo');
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/processos/invalid/resumo');

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando resumo não foi gerado', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/processos/999999/resumo');

      expect([500, 404]).toContain(res.status);
    });
  });

  describe('GET /api/escavador/v2/processos/:id/resumo/status', () => {
    it('✅ sucesso: retorna 200 com progresso', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            status: 'concluido',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      const res = await app.request('/api/escavador/v2/processos/123/resumo/status');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('status');
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/processos/invalid/resumo/status');

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando status não encontrado', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/processos/999999/resumo/status');

      expect([500, 404]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: DOWNLOAD DE DOCUMENTOS (1 endpoint, 3 testes)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('GET /api/escavador/v2/documentos/:id/download', () => {
    it('✅ sucesso: retorna 200 com PDF', async () => {
      const pdfBuffer = Buffer.from('PDF content');
      fetchSpy.mockResolvedValue(
        new Response(pdfBuffer, {
          status: 200,
          headers: { 'content-type': 'application/pdf' },
        }),
      );

      const res = await app.request('/api/escavador/v2/documentos/1/download');

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('application/pdf');
    });

    it('❌ erro: retorna 400 com ID inválido', async () => {
      const res = await app.request('/api/escavador/v2/documentos/invalid/download');

      expect(res.status).toBe(400);
    });

    it('⊘ sem resultado: retorna 500 quando documento não existe', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/documentos/999999/download');

      expect([500, 404]).toContain(res.status);
    });
  });
});
