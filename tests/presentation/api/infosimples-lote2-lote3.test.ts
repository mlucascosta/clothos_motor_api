/**
 * @fileoverview Testes e2e — Infosimples / Lote 2 (Antecedentes Criminais) + Lote 3 (BCB, B3, CADE, CVM, MPF, MP-SP)
 * 3 casos por endpoint: sucesso (code 200), erro de sistema (code 616 → HTTP 500),
 * nada consta (code 612 → HTTP 200, credit-safety invariant).
 * Endpoints com params required/oneOf: adicional caso 400.
 * @module tests/presentation/api/infosimples-lote2-lote3.test
 */

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

describe('POST /api/infosimples — Lote 2 + Lote 3', () => {
  let saveSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  const mockEnvelope = (overrides: object) => ({
    code: 200,
    code_message: 'Consulta realizada com sucesso',
    header: { api_version: '2', billable: true, price: 0.5, elapsed_time_in_milliseconds: 800 },
    data_count: 0,
    data: null,
    errors: [],
    ...overrides,
  });

  beforeEach(() => {
    process.env.INFOSIMPLES_TOKEN = 'test-token-12345';
    saveSpy = jest.spyOn(rawStore, 'save').mockImplementation(() => {});
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockEnvelope({})), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  afterEach(() => {
    saveSpy.mockRestore();
    fetchSpy.mockRestore();
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────
  // LOTE 2 — ANTECEDENTES CRIMINAIS
  // ──────────────────────────────────────────────

  // MG — sem parâmetros obrigatórios (rg e cpf opcionais)
  describe('consultas/antecedentes-criminais/mg', () => {
    const PATH = '/api/infosimples/consultas/antecedentes-criminais/mg';

    it('sucesso — code 200, retorna HTTP 200 com dados de antecedentes MG', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'João Silva',
                  situacao: 'Com antecedentes',
                  antecedentes: [{ numero_processo: '0001234-12.2020.8.13.0024', crime: 'Furto' }],
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/antecedentes-criminais/mg',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // PF/EMIT — required: nome + birthdate
  describe('consultas/antecedentes-criminais/pf/emit', () => {
    const PATH = '/api/infosimples/consultas/antecedentes-criminais/pf/emit';

    it('sucesso — code 200, retorna HTTP 200 com certidão emitida', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'Maria Souza',
                  certidao_codigo: 'CERT-2024-001',
                  resultado: 'Negativa',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?nome=Maria+Souza&birthdate=1990-05-15`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/antecedentes-criminais/pf/emit',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?nome=Maria+Souza&birthdate=1990-05-15`, {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?nome=Pessoa+Inexistente&birthdate=1800-01-01`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('connection refused'));

      const res = await app.request(`${PATH}?nome=Teste&birthdate=1990-01-01`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando nome ausente', async () => {
      const res = await app.request(`${PATH}?birthdate=1990-01-01`, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('retorna 400 quando birthdate ausente', async () => {
      const res = await app.request(`${PATH}?nome=Teste`, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // PF/VAL — required: certidao_codigo + birthdate
  describe('consultas/antecedentes-criminais/pf/val', () => {
    const PATH = '/api/infosimples/consultas/antecedentes-criminais/pf/val';

    it('sucesso — code 200, retorna HTTP 200 com validação da certidão', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  certidao_codigo: 'CERT-2024-001',
                  valida: true,
                  resultado: 'Negativa',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?certidao_codigo=CERT-2024-001&birthdate=1990-05-15`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/antecedentes-criminais/pf/val',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?certidao_codigo=CERT-001&birthdate=1990-01-01`, {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?certidao_codigo=INVALIDO&birthdate=2000-01-01`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?certidao_codigo=CERT-001&birthdate=1990-01-01`, {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando certidao_codigo ausente', async () => {
      const res = await app.request(`${PATH}?birthdate=1990-01-01`, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // SP — required: nome + birthdate + genero
  describe('consultas/antecedentes-criminais/sp', () => {
    const PATH = '/api/infosimples/consultas/antecedentes-criminais/sp';

    it('sucesso — code 200, retorna HTTP 200 com dados de antecedentes SP', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'Carlos Lima',
                  genero: 'M',
                  situacao: 'Sem antecedentes',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?nome=Carlos+Lima&birthdate=1985-03-20&genero=M`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/antecedentes-criminais/sp',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?nome=Teste&birthdate=1990-01-01&genero=M`, {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?nome=Ninguem&birthdate=2100-01-01&genero=F`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?nome=Teste&birthdate=1990-01-01&genero=M`, {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando genero ausente', async () => {
      const res = await app.request(`${PATH}?nome=Teste&birthdate=1990-01-01`, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 3 — BCB
  // ──────────────────────────────────────────────

  // CHEQUES-SEM-FUNDO — sem parâmetros obrigatórios
  describe('consultas/bcb/cheques-sem-fundo', () => {
    const PATH = '/api/infosimples/consultas/bcb/cheques-sem-fundo';

    it('sucesso — code 200, retorna HTTP 200 com ocorrências de cheques sem fundo', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'João Silva',
                  banco: 'Banco do Brasil',
                  agencia: '0001',
                  quantidade_ocorrencias: 3,
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/bcb/cheques-sem-fundo',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // VALORES-RECEBER — oneOf: cpf ou cnpj
  describe('consultas/bcb/valores-receber', () => {
    const PATH = '/api/infosimples/consultas/bcb/valores-receber';

    it('sucesso — code 200, retorna HTTP 200 com valores a receber por CPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  cpf: '11144477735',
                  valor_total: 2500.0,
                  quantidade_contas: 2,
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/bcb/valores-receber',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando cpf e cnpj ausentes (oneOf)', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toContain('cpf');
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 3 — B3
  // ──────────────────────────────────────────────

  // PARTICIPANTES — required: cnpj
  describe('consultas/b3/participantes', () => {
    const PATH = '/api/infosimples/consultas/b3/participantes';

    it('sucesso — code 200, retorna HTTP 200 com dados do participante B3', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  cnpj: '33200056000149',
                  razao_social: 'Empresa XYZ S.A.',
                  tipo_participante: 'Corretora',
                  situacao: 'Ativo',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/b3/participantes',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?cnpj=00000000000000`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando cnpj ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 3 — CADE
  // ──────────────────────────────────────────────

  // PROCESSOS — sem parâmetros obrigatórios (processo opcional)
  describe('consultas/cade/processos', () => {
    const PATH = '/api/infosimples/consultas/cade/processos';

    it('sucesso — code 200, retorna HTTP 200 com processos CADE', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  numero_processo: '08700.001234/2020-55',
                  assunto: 'Ato de concentração',
                  situacao: 'Em análise',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?processo=08700.001234/2020-55`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/cade/processos',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?processo=08700.001234/2020-55`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 3 — CVM
  // ──────────────────────────────────────────────

  // PARTICIPANTE — sem parâmetros obrigatórios (name/cpf/cnpj opcionais)
  describe('consultas/cvm/participante', () => {
    const PATH = '/api/infosimples/consultas/cvm/participante';

    it('sucesso — code 200, retorna HTTP 200 com dados do participante CVM', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'Fundo XYZ',
                  tipo_participante: 'Fundo de Investimento',
                  situacao: 'Ativo',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?name=Fundo+XYZ`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/cvm/participante',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?name=Fundo+XYZ`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // PROCESSO-ADMINISTRATIVO — sem parâmetros obrigatórios
  describe('consultas/cvm/processo-administrativo', () => {
    const PATH = '/api/infosimples/consultas/cvm/processo-administrativo';

    it('sucesso — code 200, retorna HTTP 200 com processos administrativos CVM', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  numero_processo: 'PAS CVM 15/2019',
                  assunto: 'Insider trading',
                  situacao: 'Julgado',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/cvm/processo-administrativo',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // SANCIONADORES — sem parâmetros obrigatórios
  describe('consultas/cvm/sancionadores', () => {
    const PATH = '/api/infosimples/consultas/cvm/sancionadores';

    it('sucesso — code 200, retorna HTTP 200 com sancionados CVM', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'Pedro Alves',
                  penalidade: 'Multa',
                  valor_multa: 500000.0,
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/cvm/sancionadores',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 3 — MPF
  // ──────────────────────────────────────────────

  // AMAZONIA-PROTEGE — oneOf: cpf ou cnpj
  describe('consultas/mpf/amazonia-protege', () => {
    const PATH = '/api/infosimples/consultas/mpf/amazonia-protege';

    it('sucesso — code 200, retorna HTTP 200 com dados Amazônia Protege', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  cpf: '11144477735',
                  nome: 'Fazendeiro Silva',
                  situacao: 'Embargado',
                  municipio: 'Altamira',
                  estado: 'PA',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/mpf/amazonia-protege',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando cpf e cnpj ausentes (oneOf)', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toContain('cpf');
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // CERTIDAO-NEGATIVA — oneOf: cpf ou cnpj
  describe('consultas/mpf/certidao-negativa', () => {
    const PATH = '/api/infosimples/consultas/mpf/certidao-negativa';

    it('sucesso — code 200, retorna HTTP 200 com certidão negativa MPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  cpf: '11144477735',
                  negativa: true,
                  numero_certidao: 'CN-MPF-2024-12345',
                  data_emissao: '2024-01-15',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/mpf/certidao-negativa',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando cpf e cnpj ausentes (oneOf)', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // LAVA-JATO — required: termos
  describe('consultas/mpf/lava-jato', () => {
    const PATH = '/api/infosimples/consultas/mpf/lava-jato';

    it('sucesso — code 200, retorna HTTP 200 com registros Lava Jato', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'Empreiteira ABC',
                  fase: 'Fase 42',
                  descricao: 'Delação premiada',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?termos=Empreiteira+ABC`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/mpf/lava-jato',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?termos=Empreiteira+ABC`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?termos=TermoInexistente`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?termos=teste`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando termos ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // PROCESSOS — required: query
  describe('consultas/mpf/processos', () => {
    const PATH = '/api/infosimples/consultas/mpf/processos';

    it('sucesso — code 200, retorna HTTP 200 com processos MPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 2,
              data: [
                { numero_processo: '5001234-12.2022.4.03.6100', assunto: 'Crime ambiental' },
                { numero_processo: '5009876-45.2021.4.03.6100', assunto: 'Lavagem de dinheiro' },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?query=João+Silva`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(2);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/mpf/processos',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?query=João+Silva`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?query=pessoa+inexistente`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?query=teste`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando query ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 3 — MP-SP
  // ──────────────────────────────────────────────

  // INQUERITO-CIVIL — sem parâmetros obrigatórios (cpf/cnpj/nome opcionais)
  describe('consultas/mp/sp/inquerito-civil', () => {
    const PATH = '/api/infosimples/consultas/mp/sp/inquerito-civil';

    it('sucesso — code 200, retorna HTTP 200 com inquéritos civis MP-SP', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 200,
              data_count: 1,
              data: [
                {
                  nome: 'Empresa Ambiental Ltda',
                  numero_inquerito: 'IC-00123/2021',
                  assunto: 'Poluição hídrica',
                  situacao: 'Em andamento',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(200);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/mp/sp/inquerito-civil',
          status: 'success',
        }),
      );
    });

    it('erro de sistema — code 616, retorna HTTP 500 com kind UPSTREAM_ERROR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              code: 616,
              code_message: 'Erro na fonte',
              errors: ['fonte indisponível'],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();
      expect(body.kind).toBe('UPSTREAM_ERROR');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', error_kind: 'UPSTREAM_ERROR' }),
      );
    });

    it('nada consta — code 612, retorna HTTP 200 (credit-safety)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEnvelope({ code: 612, data_count: 0, data: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha de transporte — fetch rejeita → HTTP 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });
});
