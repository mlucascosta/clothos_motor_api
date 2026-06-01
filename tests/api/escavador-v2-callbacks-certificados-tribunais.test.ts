/**
 * @fileoverview Testes E2E para Escavador V2 — Callbacks, Certificados, Tribunais
 * Cobertura: 11 endpoints (3 callbacks + 6 certificados + 2 tribunais)
 * 3 testes por endpoint (33 total): sucesso, erro, sem resultado
 */

import { app } from '../../src/presentation/api/app';

describe('Escavador V2 — Callbacks, Certificados, Tribunais (E2E)', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: CALLBACKS V2 (3 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('GET /api/escavador/v2/callbacks', () => {
    it('✅ sucesso: retorna 200 com array de callbacks', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{ id: 1, tipo: 'pending' }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/callbacks');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(Array.isArray(body.items)).toBe(true);
      expect((body.items as Array<unknown>).length).toBe(1);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/callbacks');

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
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

      const res = await app.request('/api/escavador/v2/callbacks');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('POST /api/escavador/v2/callbacks/recebidos', () => {
    it('✅ sucesso: ids válidos retorna 204', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/callbacks/recebidos', {
        method: 'POST',
        body: JSON.stringify({ ids: [1, 2, 3] }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: retorna 400 com body inválido', async () => {
      const res = await app.request('/api/escavador/v2/callbacks/recebidos', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: array vazio retorna 422', async () => {
      const res = await app.request('/api/escavador/v2/callbacks/recebidos', {
        method: 'POST',
        body: JSON.stringify({ ids: [] }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });
  });

  describe('POST /api/escavador/v2/callbacks/:id/reenviar', () => {
    it('✅ sucesso: id válido retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            tipo: 'resent',
            tentativas: 2,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/callbacks/1/reenviar', {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id).toBe(1);
      expect(body.tipo).toBe('resent');
    });

    it('❌ erro: id inexistente retorna 500', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/callbacks/999/reenviar', {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: id inválido retorna 400', async () => {
      const res = await app.request('/api/escavador/v2/callbacks/abc/reenviar', {
        method: 'POST',
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: CERTIFICADOS V2 (6 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('GET /api/escavador/v2/certificados', () => {
    it('✅ sucesso: retorna 200 com array de certificados', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [
              {
                id: 1,
                nome: 'Certificado ABC LTDA',
                validade: '2025-12-31',
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/certificados');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('items');
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/certificados');

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/certificados');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('POST /api/escavador/v2/certificados', () => {
    it('✅ sucesso: dados válidos retorna 201', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            nome: 'Certificado ABC LTDA',
            validade: '2025-12-31',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/certificados', {
        method: 'POST',
        body: JSON.stringify({
          nome: 'Certificado ABC LTDA',
          arquivo_base64: 'MIIG...',
          senha: 'senha_123',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(201);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('id');
      expect(body.nome).toBe('Certificado ABC LTDA');
    });

    it('❌ erro: arquivo_base64 inválido retorna 500', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Invalid certificate' }), {
          status: 500,
        }),
      );

      const res = await app.request('/api/escavador/v2/certificados', {
        method: 'POST',
        body: JSON.stringify({
          nome: 'Certificado',
          arquivo_base64: 'INVALID',
          senha: 'senha',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: body incompleto retorna 422', async () => {
      const res = await app.request('/api/escavador/v2/certificados', {
        method: 'POST',
        body: JSON.stringify({ nome: 'Certificado' }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });
  });

  describe('GET /api/escavador/v2/certificados/:id', () => {
    it('✅ sucesso: id válido retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            nome: 'Certificado ABC LTDA',
            validade: '2025-12-31',
            autenticacoes: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/certificados/1');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id).toBe(1);
      expect(body.nome).toBe('Certificado ABC LTDA');
    });

    it('❌ erro: id inexistente retorna 500', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found' }), { status: 500 }),
      );

      const res = await app.request('/api/escavador/v2/certificados/999');

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: id inválido retorna 400', async () => {
      const res = await app.request('/api/escavador/v2/certificados/abc');

      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/escavador/v2/certificados/:id', () => {
    it('✅ sucesso: id válido retorna 204', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/certificados/1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: id protegido retorna 500', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Cannot delete protected certificate' }), {
          status: 500,
        }),
      );

      const res = await app.request('/api/escavador/v2/certificados/999', {
        method: 'DELETE',
      });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: id inválido retorna 400', async () => {
      const res = await app.request('/api/escavador/v2/certificados/abc', {
        method: 'DELETE',
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });
  });

  describe('POST /api/escavador/v2/certificados/:id/autenticacoes', () => {
    it('✅ sucesso: tipo e valor válidos retorna 201', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 5,
            tipo: 'password',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/certificados/1/autenticacoes', {
        method: 'POST',
        body: JSON.stringify({ tipo: 'password', valor: 'senha_123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(201);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.id).toBe(5);
      expect(body.tipo).toBe('password');
    });

    it('❌ erro: tipo inválido retorna 422', async () => {
      const res = await app.request('/api/escavador/v2/certificados/1/autenticacoes', {
        method: 'POST',
        body: JSON.stringify({ tipo: '', valor: 'senha' }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: tipo missing retorna 422', async () => {
      const res = await app.request('/api/escavador/v2/certificados/1/autenticacoes', {
        method: 'POST',
        body: JSON.stringify({ valor: 'senha' }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(422);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/escavador/v2/certificados/:id/autenticacoes/:autenticacaoId', () => {
    it('✅ sucesso: ids válidos retorna 204', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/certificados/1/autenticacoes/5', {
        method: 'DELETE',
      });

      expect(res.status).toBe(204);
    });

    it('❌ erro: autenticacaoId não existe retorna 500', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Authentication not found' }), {
          status: 500,
        }),
      );

      const res = await app.request('/api/escavador/v2/certificados/1/autenticacoes/999', {
        method: 'DELETE',
      });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: ids inválidos retorna 400', async () => {
      const res = await app.request('/api/escavador/v2/certificados/abc/autenticacoes/def', {
        method: 'DELETE',
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SEÇÃO: TRIBUNAIS V2 (2 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('GET /api/escavador/v2/tribunais/sistemas', () => {
    it('✅ sucesso: retorna 200 com array de sistemas', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [
              { id: 1, nome: 'Superior Tribunal de Justiça', sigla: 'STJ' },
              { id: 2, nome: 'Tribunal de Justiça do Estado de São Paulo', sigla: 'TJ/SP' },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/tribunais/sistemas');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('items');
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/tribunais/sistemas');

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: retorna 200 com array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/tribunais/sistemas');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });

  describe('GET /api/escavador/v2/tribunais', () => {
    it('✅ sucesso: com sistema_id válido retorna 200', async () => {
      fetchSpy.mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [
              { id: 10, nome: '1ª Vara Cível', sistema_id: 2 },
              { id: 11, nome: '2ª Vara Cível', sistema_id: 2 },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request('/api/escavador/v2/tribunais?sistema_id=2');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('items');
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('❌ erro: retorna 500 quando upstream falha', async () => {
      fetchSpy.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

      const res = await app.request('/api/escavador/v2/tribunais');

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body).toHaveProperty('error');
    });

    it('⊘ sem resultado: sistema_id inexistente retorna array vazio', async () => {
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request('/api/escavador/v2/tribunais?sistema_id=999');

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect((body.items as Array<unknown>).length).toBe(0);
    });
  });
});
