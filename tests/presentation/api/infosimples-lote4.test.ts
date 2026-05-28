/**
 * @fileoverview Testes e2e — Infosimples / Portal Transparência (Lote 4)
 * Cobre 15 endpoints: auxilio, bolsa, bpc, busca, ceaf, ceis, cepim, cnep,
 * convenios, leniencia, peti, repasse, safra, seguro, servidor.
 * 3 casos por endpoint: sucesso, sucesso-sem-resultado (603), falha upstream.
 * Endpoints com params required/oneOf: adicional caso 400.
 * @module tests/presentation/api/infosimples-lote4.test
 */

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

describe('POST /api/infosimples — Portal Transparência', () => {
  let saveSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  const envelope = (overrides: object) => ({
    code: 0,
    code_message: 'OK',
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
      new Response(JSON.stringify(envelope({})), {
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
  // AUXÍLIO
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/auxilio', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/auxilio';

    it('sucesso — retorna 200 com registros de auxílio', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cpf: '11144477735', nome: 'João Silva', valor: 600, competencia: '2024-01' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?data_inicio=2024-01-01&data_fim=2024-01-31`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/auxilio', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?data_inicio=2020-01-01&data_fim=2020-01-31`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?data_inicio=2024-01-01&data_fim=2024-01-31`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando data_inicio ausente', async () => {
      const res = await app.request(`${PATH}?data_fim=2024-01-31`, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // BOLSA FAMÍLIA
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/bolsa', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/bolsa';

    it('sucesso — retorna 200 com registros de bolsa família', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cpf: '11144477735', nome: 'Maria Souza', valor: 400, competencia: '2024-01', municipio: 'São Paulo', uf: 'SP' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?data_inicio=2024-01-01&data_fim=2024-01-31`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/bolsa', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?data_inicio=2010-01-01&data_fim=2010-01-31`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('connection refused'));
      const res = await app.request(`${PATH}?data_inicio=2024-01-01&data_fim=2024-01-31`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando data_fim ausente', async () => {
      const res = await app.request(`${PATH}?data_inicio=2024-01-01`, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // BPC
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/bpc', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/bpc';

    it('sucesso — retorna 200 com dados de BPC', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cpf: '11144477735', nome: 'Pedro Lima', tipo_beneficio: 'Idoso', valor: 1412 }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/bpc', tipo_param: 'cpf', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cpf ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // BUSCA
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/busca', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/busca';

    it('sucesso — retorna 200 com resultados de busca', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 2,
            data: [
              { titulo: 'Resultado 1', url: 'https://portaltransparencia.gov.br/r1', orgao: 'TCU' },
              { titulo: 'Resultado 2', url: 'https://portaltransparencia.gov.br/r2', orgao: 'CGU' },
            ],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?query=licitacao`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(2);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/busca', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?query=zzzzzzzzz`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?query=licitacao`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando query ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // CEAF
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/ceaf', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/ceaf';

    it('sucesso — retorna 200 com dados de CEAF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cpf: '11144477735', nome: 'Ana Costa', medicamento: 'Adalimumabe', cid: 'M06' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/ceaf', tipo_param: 'cpf', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cpf ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // CEIS
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/ceis', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/ceis';

    it('sucesso — retorna 200 com sanções por CNPJ', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cnpj: '33200056000149', razao_social: 'Empresa XYZ', tipo_sancao: 'Suspensão', data_inicio: '2022-03-01' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/ceis', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
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
  // CEPIM
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/cepim', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/cepim';

    it('sucesso — retorna 200 com entidades impedidas por CNPJ', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cnpj: '33200056000149', razao_social: 'ONG Exemplo', motivo_impedimento: 'Irregularidade prestação contas' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/cepim', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=00000000000000`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('connection refused'));
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cnpj ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // CNEP
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/cnep', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/cnep';

    it('sucesso — retorna 200 com punições por CNPJ', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cnpj: '33200056000149', razao_social: 'Construtora ABC', tipo_sancao: 'Multa', valor_multa: 50000 }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/cnep', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
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
  // CONVÊNIOS
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/convenios', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/convenios';

    it('sucesso — retorna 200 com convênios por convenente', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ numero_convenio: '123456/2023', convenente: 'Prefeitura de SP', valor_global: 500000, situacao: 'Vigente' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?convenente=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/convenios', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?convenente=00000000000000`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?convenente=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando convenente ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // LENIÊNCIA
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/leniencia', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/leniencia';

    it('sucesso — retorna 200 com acordos de leniência por CNPJ', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cnpj: '33200056000149', razao_social: 'Empreiteira Delta', numero_acordo: 'LA-001/2019', situacao: 'Em vigor' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/leniencia', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=00000000000000`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cnpj ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // PETI
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/peti', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/peti';

    it('sucesso — retorna 200 com dados de PETI por CPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cpf: '11144477735', nome: 'Lucas Ferreira', valor: 200, competencia: '2024-01', municipio: 'Recife', uf: 'PE' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/peti', tipo_param: 'cpf', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cpf ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // REPASSE
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/repasse', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/repasse';

    it('sucesso — retorna 200 com dados de repasse por ano e localidade', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ ano: '2024', localidade: '3550308', municipio: 'São Paulo', uf: 'SP', valor: 1000000 }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?ano=2024&localidade=3550308`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/repasse', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?ano=1900&localidade=0000000`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?ano=2024&localidade=3550308`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando ano ausente', async () => {
      const res = await app.request(`${PATH}?localidade=3550308`, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // SAFRA
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/safra', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/safra';

    it('sucesso — retorna 200 com dados de Garantia Safra por CPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cpf: '11144477735', nome: 'José Pereira', valor: 850, ano_safra: '2023/2024', municipio: 'Juazeiro', uf: 'BA' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/safra', tipo_param: 'cpf', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cpf ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // SEGURO DEFESO (sem parâmetros obrigatórios)
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/seguro', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/seguro';

    it('sucesso — retorna 200 com registros de seguro defeso', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cpf: '11144477735', nome: 'Carlos Pescador', valor: 1412, parcela: '1/5', municipio: 'Belém', uf: 'PA' }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/seguro', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ──────────────────────────────────────────────
  // SERVIDOR FEDERAL
  // ──────────────────────────────────────────────
  describe('consultas/portal-transparencia/servidor', () => {
    const PATH = '/api/infosimples/consultas/portal-transparencia/servidor';

    it('sucesso — retorna 200 com dados do servidor federal por CPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({
            data_count: 1,
            data: [{
              cpf: '11144477735',
              nome: 'Fernanda Oliveira',
              matricula: '1234567',
              cargo: 'Analista',
              orgao: 'Ministério da Fazenda',
              remuneracao_bruta: 15000,
            }],
          })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/portal-transparencia/servidor', tipo_param: 'cpf', status: 'success' }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cpf=99999999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cpf ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
