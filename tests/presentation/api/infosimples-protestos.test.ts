/**
 * @fileoverview Testes e2e — Infosimples / Protestos (Lote 1)
 * Cobre: cenprot-sp/protestos, ieptb/protestos, ieptb/protestos/detalhes-sp
 * 3 casos por endpoint: sucesso, sucesso-sem-resultado (603), falha upstream.
 * @module tests/presentation/api/infosimples-protestos.test
 */

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

describe('POST /api/infosimples — Protestos', () => {
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
  // CENPROT-SP / Protestos
  // ──────────────────────────────────────────────
  describe('consultas/cenprot-sp/protestos', () => {
    const PATH = '/api/infosimples/consultas/cenprot-sp/protestos';

    it('sucesso — retorna 200 com protestos por CPF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  cpf: '11144477735',
                  nome: 'João Silva',
                  quantidade_protestos: 2,
                  valor_total: 1500.0,
                  protestos: [
                    { cartorio: '1º Tabelião SP', data_protesto: '2023-01-15', valor: 800 },
                    { cartorio: '3º Tabelião SP', data_protesto: '2024-03-10', valor: 700 },
                  ],
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/cenprot-sp/protestos',
          tipo_param: 'cpf',
          param: '11144477735',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null (nenhum protesto)', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          tipo_param: 'cnpj',
          status: 'success',
        }),
      );
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando cpf e cnpj estão ausentes (oneOf)', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.error).toContain('cpf');
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // IEPTB / Protestos
  // ──────────────────────────────────────────────
  describe('consultas/ieptb/protestos', () => {
    const PATH = '/api/infosimples/consultas/ieptb/protestos';

    it('sucesso — retorna 200 com obter_detalhes para consulta subsequente', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  cpf: '11144477735',
                  quantidade_protestos: 1,
                  obter_detalhes: 'token-detalhe-abc123',
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
      expect(body.data_count).toBe(1);

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/ieptb/protestos',
          tipo_param: 'cpf',
          status: 'success',
        }),
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

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('connection refused'));

      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cpf e cnpj ausentes (oneOf)', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // IEPTB / Protestos Detalhes SP
  // ──────────────────────────────────────────────
  describe('consultas/ieptb/protestos/detalhes-sp', () => {
    const PATH = '/api/infosimples/consultas/ieptb/protestos/detalhes-sp';

    it('sucesso — retorna 200 com detalhes do protesto', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  numero_protocolo: 'PROT-001',
                  data_protesto: '2023-01-15',
                  valor: 800.0,
                  apresentante: 'Banco XYZ',
                  cedente: 'Empresa ABC',
                  especie: 'DM',
                  situacao: 'Protestado',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?obter_detalhes=token-detalhe-abc123`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/ieptb/protestos/detalhes-sp',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?obter_detalhes=token-inexistente`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?obter_detalhes=token-abc`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando obter_detalhes está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
