/**
 * @fileoverview Testes e2e para rotas do Infosimples — RFB (CPF/CNPJ).
 * 3 casos por endpoint: sucesso, sucesso-sem-resultado (code 603), falha upstream.
 * @module tests/presentation/api/infosimples.test
 */

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

describe('POST /api/infosimples — RFB (CPF / CNPJ)', () => {
  let saveSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  const mockEnvelope = (overrides: object) => ({
    code: 0,
    code_message: 'OK',
    header: { api_version: '2', billable: false, price: 0, elapsed_time_in_milliseconds: 100 },
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
  // CPF — consultas/receita-federal/cpf
  // ──────────────────────────────────────────────
  describe('consultas/receita-federal/cpf', () => {
    const PATH = '/api/infosimples/consultas/receita-federal/cpf';

    it('sucesso — retorna 200 com dados do CPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              data_count: 1,
              data: [{ cpf: '11144477735', nome: 'João Silva', situacao: 'Ativa' }],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(Array.isArray(body.data)).toBe(true);

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/receita-federal/cpf',
          tipo_param: 'cpf',
          param: '11144477735',
          status: 'success',
        }),
      );

      const url = fetchSpy.mock.calls[0][0] as string;
      expect(url).toContain('token=');
      expect(url).toContain('cpf=11144477735');
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(mockEnvelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'success' }),
      );
    });

    it('falha — upstream timeout → 500 persiste erro', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toBeDefined();

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          status: 'error',
          error_kind: expect.any(String),
        }),
      );
    });

    it('retorna 400 quando cpf está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // CNPJ — consultas/receita-federal/cnpj
  // ──────────────────────────────────────────────
  describe('consultas/receita-federal/cnpj', () => {
    const PATH = '/api/infosimples/consultas/receita-federal/cnpj';

    it('sucesso — retorna 200 com dados do CNPJ', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            mockEnvelope({
              data_count: 1,
              data: [{ cnpj: '33200056000149', razao_social: 'Empresa LTDA', situacao: 'Ativa' }],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/receita-federal/cnpj',
          tipo_param: 'cnpj',
          param: '33200056000149',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(mockEnvelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=00000000000191`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream 500 → persiste erro', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('upstream error'));

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cnpj está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // Alias curtos (backward-compat)
  // ──────────────────────────────────────────────
  describe('Aliases curtos', () => {
    it('cpf → resolve CadastroPessoaFisica', async () => {
      const res = await app.request('/api/infosimples/cpf?cpf=11144477735', { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'cpf' }),
      );
    });

    it('cnpj → resolve CadastroPessoaJuridica', async () => {
      const res = await app.request('/api/infosimples/cnpj?cnpj=33200056000149', {
        method: 'POST',
      });
      expect(res.status).toBe(200);
    });
  });

  // ──────────────────────────────────────────────
  // Registry
  // ──────────────────────────────────────────────
  describe('Registry', () => {
    it('retorna 500 quando endpoint não existe no registry', async () => {
      const res = await app.request('/api/infosimples/endpoint-invalido', { method: 'POST' });
      expect(res.status).toBe(500);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toContain('desconhecida');
    });
  });
});
