/**
 * @fileoverview Testes e2e — Infosimples / Prefeituras IPTU + Sefaz + Registradores (Lote 7 + 8)
 * 3 casos por endpoint: sucesso (code 0, data com item), sucesso-sem-resultado (code 603, data null),
 * falha upstream (throw → 500). Endpoints com required: caso 400 também.
 * @module tests/presentation/api/infosimples-lote7-lote8.test
 */

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

describe('POST /api/infosimples — Prefeituras + Sefaz + Registradores', () => {
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
    process.env.INFOSIMPLES_TOKEN = 'test-token';
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
  // LOTE 7 — PREFEITURAS IPTU + SEFAZ
  // ──────────────────────────────────────────────

  // pref/mg/belo-horizonte/cndiptu
  describe('consultas/pref/mg/belo-horizonte/cndiptu', () => {
    const PATH = '/api/infosimples/consultas/pref/mg/belo-horizonte/cndiptu';

    it('sucesso — retorna 200 com certidão negativa de débito IPTU', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  identificador: '4100123456',
                  inscricao: '0001.0002.0003.000',
                  situacao: 'Negativa',
                  certidao_numero: 'CND-2024-001',
                  data_emissao: '2024-01-15',
                  validade: '2024-07-15',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(
        `${PATH}?identificador=4100123456&data_inicio=2024-01-01&data_fim=2024-12-31`,
        { method: 'POST' },
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/mg/belo-horizonte/cndiptu',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(
        `${PATH}?identificador=9999999&data_inicio=2024-01-01&data_fim=2024-12-31`,
        { method: 'POST' },
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream timeout → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(
        `${PATH}?identificador=4100123456&data_inicio=2024-01-01&data_fim=2024-12-31`,
        { method: 'POST' },
      );

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando identificador está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // pref/mg/belo-horizonte/iptu
  describe('consultas/pref/mg/belo-horizonte/iptu', () => {
    const PATH = '/api/infosimples/consultas/pref/mg/belo-horizonte/iptu';

    it('sucesso — retorna 200 com dados do IPTU BH', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  identificador: '4100123456',
                  inscricao: '0001.0002.0003.000',
                  endereco: 'Av. Afonso Pena, 1000, Belo Horizonte - MG',
                  ano: '2024',
                  situacao: 'Em aberto',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?identificador=4100123456`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/mg/belo-horizonte/iptu',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?identificador=9999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('connection refused'));

      const res = await app.request(`${PATH}?identificador=4100123456`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando identificador está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // pref/rj/rio-janeiro/iptu
  describe('consultas/pref/rj/rio-janeiro/iptu', () => {
    const PATH = '/api/infosimples/consultas/pref/rj/rio-janeiro/iptu';

    it('sucesso — retorna 200 com dados do IPTU Rio', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  inscricao: '0.1234.5678.00001',
                  endereco: 'Rua da Carioca, 10, Centro, Rio de Janeiro - RJ',
                  ano: '2024',
                  situacao: 'Pago',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?inscricao=0.1234.5678.00001`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/rj/rio-janeiro/iptu',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?inscricao=9999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?inscricao=0.1234.5678.00001`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando inscricao está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // pref/sp/campinas/iptu
  describe('consultas/pref/sp/campinas/iptu', () => {
    const PATH = '/api/infosimples/consultas/pref/sp/campinas/iptu';

    it('sucesso — retorna 200 com dados do IPTU Campinas', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  codigo_cartografico: '3234567890123456',
                  nome_devedor: 'EMPRESA TESTE LTDA',
                  endereco: 'Rua Barão de Jaguara, 901, Centro, Campinas - SP',
                  ano: '2024',
                  situacao: 'Em aberto',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(
        `${PATH}?codigo_cartografico=3234567890123456&nome_devedor=EMPRESA+TESTE+LTDA`,
        { method: 'POST' },
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/sp/campinas/iptu',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?codigo_cartografico=9999&nome_devedor=INEXISTENTE`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(
        `${PATH}?codigo_cartografico=3234567890123456&nome_devedor=TESTE`,
        { method: 'POST' },
      );

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando codigo_cartografico está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // pref/sp/sao-paulo/dados-imovel
  describe('consultas/pref/sp/sao-paulo/dados-imovel', () => {
    const PATH = '/api/infosimples/consultas/pref/sp/sao-paulo/dados-imovel';

    it('sucesso — retorna 200 com dados do imóvel SP', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  cadastro_imovel: '123456789',
                  sql: '001.001.0001.0001.00001',
                  ano_exercicio: '2024',
                  endereco: 'Av. Paulista, 1000, Bela Vista, São Paulo - SP',
                  valor_venal_total: 500000.0,
                  situacao: 'Regular',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cadastro_imovel=123456789&ano_exercicio=2024`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/sp/sao-paulo/dados-imovel',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cadastro_imovel=9999&ano_exercicio=2024`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cadastro_imovel=123456789&ano_exercicio=2024`, {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando cadastro_imovel está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // pref/sp/sao-paulo/debitos-iptu
  describe('consultas/pref/sp/sao-paulo/debitos-iptu', () => {
    const PATH = '/api/infosimples/consultas/pref/sp/sao-paulo/debitos-iptu';

    it('sucesso — retorna 200 com débitos IPTU SP', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  cadastro_imovel: '123456789',
                  endereco: 'Av. Paulista, 1000, São Paulo - SP',
                  total_debitos: 3500.0,
                  debitos: [
                    {
                      exercicio: '2022',
                      parcela: '1',
                      valor_atualizado: 1200.0,
                      situacao: 'Em aberto',
                    },
                    {
                      exercicio: '2023',
                      parcela: '1',
                      valor_atualizado: 2300.0,
                      situacao: 'Em aberto',
                    },
                  ],
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cadastro_imovel=123456789`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/sp/sao-paulo/debitos-iptu',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?cadastro_imovel=9999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?cadastro_imovel=123456789`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando cadastro_imovel está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // pref/sp/sao-paulo/iptu2via
  describe('consultas/pref/sp/sao-paulo/iptu2via', () => {
    const PATH = '/api/infosimples/consultas/pref/sp/sao-paulo/iptu2via';

    it('sucesso — retorna 200 com 2ª via do IPTU SP', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  sql: '001.001.0001.0001.00001',
                  parcela: '1',
                  ano: '2024',
                  valor: 1200.0,
                  vencimento: '2024-02-28',
                  codigo_barras: '85620000012000020242024020010010001000100001',
                  situacao: 'Em aberto',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?sql=001.001.0001.0001.00001&parcela=1&ano=2024`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/sp/sao-paulo/iptu2via',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?sql=9999&parcela=1&ano=2024`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?sql=001.001.0001.0001.00001&parcela=1&ano=2024`, {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando sql está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // pref/sp/sao-paulo/iptu
  describe('consultas/pref/sp/sao-paulo/iptu', () => {
    const PATH = '/api/infosimples/consultas/pref/sp/sao-paulo/iptu';

    it('sucesso — retorna 200 com IPTU SP', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  sql: '001.001.0001.0001.00001',
                  endereco: 'Av. Paulista, 1000, Bela Vista, São Paulo - SP',
                  ano: '2024',
                  valor_venal: 500000.0,
                  situacao: 'Em aberto',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?sql=001.001.0001.0001.00001`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/pref/sp/sao-paulo/iptu',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?sql=9999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?sql=001.001.0001.0001.00001`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando sql está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // sefaz/df/iptu
  describe('consultas/sefaz/df/iptu', () => {
    const PATH = '/api/infosimples/consultas/sefaz/df/iptu';

    it('sucesso — retorna 200 com IPTU DF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  inscricao_imovel: 'DF-0001234567',
                  endereco: 'SQN 203 BL A AP 101, Asa Norte, Brasília - DF',
                  ano: '2024',
                  valor_venal: 350000.0,
                  situacao: 'Pago',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?inscricao_imovel=DF-0001234567`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/sefaz/df/iptu',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?inscricao_imovel=DF-9999999`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?inscricao_imovel=DF-0001234567`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando inscricao_imovel está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // sefaz/spu/certidao-imoveis
  describe('consultas/sefaz/spu/certidao-imoveis', () => {
    const PATH = '/api/infosimples/consultas/sefaz/spu/certidao-imoveis';

    it('sucesso — retorna 200 com certidão de imóveis SPU', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  tipo_certidao: 'negativa',
                  numero_certidao: 'SPU-CND-2024-001',
                  data_emissao: '2024-01-15',
                  validade: '2024-07-15',
                  situacao: 'Emitida',
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?tipo_certidao=negativa`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/sefaz/spu/certidao-imoveis',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(`${PATH}?tipo_certidao=positiva`, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(`${PATH}?tipo_certidao=negativa`, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando tipo_certidao está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // sefaz/spu/dados-imoveis (sem params required)
  describe('consultas/sefaz/spu/dados-imoveis', () => {
    const PATH = '/api/infosimples/consultas/sefaz/spu/dados-imoveis';

    it('sucesso — retorna 200 com dados de imóveis SPU', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 2,
              data: [
                {
                  rip: 'RIP-001',
                  denominacao: 'Imóvel União SP',
                  municipio: 'São Paulo',
                  uf: 'SP',
                  situacao: 'Ocupado',
                },
                {
                  rip: 'RIP-002',
                  denominacao: 'Terreno União RJ',
                  municipio: 'Rio de Janeiro',
                  uf: 'RJ',
                  situacao: 'Disponível',
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(2);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/sefaz/spu/dados-imoveis',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
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
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 8 — REGISTRADORES
  // ──────────────────────────────────────────────

  // registradores/certid/download (sem params required)
  describe('consultas/registradores/certid/download', () => {
    const PATH = '/api/infosimples/consultas/registradores/certid/download';

    it('sucesso — retorna 200 com download de certidão', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  protocolo: 'CERTID-2024-001',
                  status: 'disponivel',
                  url_download: 'https://registradores.com.br/download/certid-2024-001.pdf',
                  nome_arquivo: 'certid-2024-001.pdf',
                  data_disponibilizacao: '2024-01-20',
                  validade: '2024-04-20',
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/certid/download',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Nenhum download disponível' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // registradores/certid/pedido
  describe('consultas/registradores/certid/pedido', () => {
    const PATH = '/api/infosimples/consultas/registradores/certid/pedido';

    it('sucesso — retorna 200 com pedido de certidão', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  protocolo: 'CERTID-2024-001',
                  status: 'em_processamento',
                  uf: 'SP',
                  municipio: 'São Paulo',
                  cartorio: '1º Cartório de Registro de Imóveis',
                  tipo_certidao: 'certidao_inteiro_teor',
                  matricula: '12345',
                  data_pedido: '2024-01-15',
                  previsao_entrega: '2024-01-20',
                  valor: 120.0,
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(
        `${PATH}?uf=SP&municipio=S%C3%A3o+Paulo&cartorio=1%C2%BA+Cart%C3%B3rio&tipo_certidao=certidao_inteiro_teor&matricula=12345`,
        { method: 'POST' },
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/certid/pedido',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(
        `${PATH}?uf=XX&municipio=Inexistente&cartorio=Cartorio&tipo_certidao=tipo&matricula=99999`,
        { method: 'POST' },
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(
        `${PATH}?uf=SP&municipio=SaoPaulo&cartorio=1Cartorio&tipo_certidao=tipo&matricula=12345`,
        { method: 'POST' },
      );

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando uf está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // registradores/certid/recibo (sem params required)
  describe('consultas/registradores/certid/recibo', () => {
    const PATH = '/api/infosimples/consultas/registradores/certid/recibo';

    it('sucesso — retorna 200 com recibo de certidão', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  protocolo: 'CERTID-2024-001',
                  status: 'pago',
                  cartorio: '1º Cartório de Registro de Imóveis',
                  tipo_certidao: 'certidao_inteiro_teor',
                  matricula: '12345',
                  valor: 120.0,
                  recibo_numero: 'REC-2024-001',
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/certid/recibo',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Nenhum recibo encontrado' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // registradores/info-conta (sem params required)
  describe('consultas/registradores/info-conta', () => {
    const PATH = '/api/infosimples/consultas/registradores/info-conta';

    it('sucesso — retorna 200 com informações da conta', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  nome: 'Empresa Consultas Ltda',
                  cpf_cnpj: '12345678000190',
                  email: 'contato@empresa.com',
                  saldo: 500.0,
                  situacao: 'ativa',
                  data_cadastro: '2022-01-01',
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/info-conta',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Conta não encontrada' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // registradores/matric/download (sem params required)
  describe('consultas/registradores/matric/download', () => {
    const PATH = '/api/infosimples/consultas/registradores/matric/download';

    it('sucesso — retorna 200 com download de matrícula', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  protocolo: 'MATRIC-2024-001',
                  status: 'disponivel',
                  url_download: 'https://registradores.com.br/download/matric-2024-001.pdf',
                  matricula: '12345',
                  cartorio: '1º Cartório de Registro de Imóveis',
                  data_disponibilizacao: '2024-01-20',
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/matric/download',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Nenhum download disponível' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // registradores/matric/lista (sem params required)
  describe('consultas/registradores/matric/lista', () => {
    const PATH = '/api/infosimples/consultas/registradores/matric/lista';

    it('sucesso — retorna 200 com lista de matrículas', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 2,
              data: [
                {
                  protocolo: 'MATRIC-2024-001',
                  status: 'disponivel',
                  matricula: '12345',
                  cartorio: '1º RI SP',
                  uf: 'SP',
                },
                {
                  protocolo: 'MATRIC-2024-002',
                  status: 'em_processamento',
                  matricula: '67890',
                  cartorio: '2º RI SP',
                  uf: 'SP',
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(2);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/matric/lista',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Nenhuma matrícula encontrada' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });

  // registradores/matric/pedido
  describe('consultas/registradores/matric/pedido', () => {
    const PATH = '/api/infosimples/consultas/registradores/matric/pedido';

    it('sucesso — retorna 200 com pedido de matrícula', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  protocolo: 'MATRIC-2024-001',
                  status: 'em_processamento',
                  matricula: '12345',
                  cartorio: '1º Cartório de Registro de Imóveis',
                  municipio: 'São Paulo',
                  uf: 'SP',
                  finalidade: 'fins_judiciais',
                  data_pedido: '2024-01-15',
                  previsao_entrega: '2024-01-20',
                  valor: 85.0,
                },
              ],
            }),
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(
        `${PATH}?matricula=12345&uf=SP&municipio=S%C3%A3o+Paulo&cartorio=1%C2%BA+RI&finalidade=fins_judiciais`,
        { method: 'POST' },
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/matric/pedido',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Dados não encontrados' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(
        `${PATH}?matricula=99999&uf=XX&municipio=Inexistente&cartorio=Cartorio&finalidade=fins_judiciais`,
        { method: 'POST' },
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(
        `${PATH}?matricula=12345&uf=SP&municipio=SaoPaulo&cartorio=1RI&finalidade=fins_judiciais`,
        { method: 'POST' },
      );

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });

    it('retorna 400 quando matricula está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // registradores/matric/recibo (sem params required)
  describe('consultas/registradores/matric/recibo', () => {
    const PATH = '/api/infosimples/consultas/registradores/matric/recibo';

    it('sucesso — retorna 200 com recibo de matrícula', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            envelope({
              data_count: 1,
              data: [
                {
                  protocolo: 'MATRIC-2024-001',
                  status: 'pago',
                  matricula: '12345',
                  cartorio: '1º RI São Paulo',
                  valor: 85.0,
                  forma_pagamento: 'cartao_credito',
                  recibo_numero: 'REC-MATRIC-2024-001',
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
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gateway: 'infosimples',
          fonte: 'consultas/registradores/matric/recibo',
          status: 'success',
        }),
      );
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ code: 603, code_message: 'Nenhum recibo encontrado' })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
    });

    it('falha — upstream error → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));

      const res = await app.request(PATH, { method: 'POST' });

      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ gateway: 'infosimples', status: 'error' }),
      );
    });
  });
});
