/**
 * @fileoverview Testes end-to-end (e2e) para rotas do DirectData.
 * Garante que todas as consultas são salvas no MongoDB via rawStore.
 * @module tests/presentation/api/directdata.test
 */

import { app } from '../../../src/presentation/api/app';
import { rawStore } from '../../../src/infrastructure/persistence/index';

describe('GET /api/directdata/*', () => {
  let saveSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    saveSpy = jest.spyOn(rawStore, 'save').mockImplementation(() => {});
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          metaDados: {
            resultado: 'SUCESSO',
            resultadoId: 1,
            consultaUid: 'uid-test',
            consultaNome: 'CadastroPessoaFisica',
            mensagem: 'Sucesso',
            data: '2025-05-28T14:00:00',
            tempoExecucaoMs: 150,
          },
          retorno: { nome: 'JOAO SILVA', cpf: '455661039898' },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );
  });

  afterEach(() => {
    saveSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it('CadastroPessoaFisica retorna 200 e persiste resultado no MongoDB', async () => {
    const res = await app.request('/api/directdata/CadastroPessoaFisica?CPF=455661039898');

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body['metaDados']).toBeDefined();
    expect((body['metaDados'] as Record<string, unknown>)['resultado']).toBe('SUCESSO');

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway: 'directdata',
        fonte: 'CadastroPessoaFisica',
        tipo_param: 'cpf',
        param: '455661039898',
        status: 'success',
      }),
    );

    const call = fetchSpy.mock.calls[0];
    const url = call[0] as string;
    expect(url).toContain('TOKEN=');
  });

  it('CadastroPessoaJuridica retorna 200 e persiste resultado no MongoDB', async () => {
    const res = await app.request('/api/directdata/CadastroPessoaJuridica?CNPJ=33200056000149');

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body['metaDados']).toBeDefined();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway: 'directdata',
        fonte: 'CadastroPessoaJuridica',
        tipo_param: 'cnpj',
        param: '33200056000149',
        status: 'success',
      }),
    );
  });

  it('OFAC retorna 200 e persiste resultado no MongoDB', async () => {
    const res = await app.request('/api/directdata/OFAC?NOME=JOSE');

    expect(res.status).toBe(200);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway: 'directdata',
        fonte: 'OFAC',
        tipo_param: 'nome',
        param: 'JOSE',
        status: 'success',
      }),
    );
  });

  it('retorna 500 e persiste erro quando upstream falha', async () => {
    fetchSpy.mockRestore();
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response('Internal Server Error', { status: 500 }),
    );

    const res = await app.request('/api/directdata/CadastroPessoaFisica?CPF=455661039898');

    expect(res.status).toBe(500);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body['error']).toBeDefined();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway: 'directdata',
        fonte: 'CadastroPessoaFisica',
        status: 'error',
        error_kind: 'UPSTREAM_ERROR',
      }),
    );

    jest.restoreAllMocks();
  });

  it('retorna 400 quando param obrigatório está ausente', async () => {
    const res = await app.request('/api/directdata/CertidaoNegativaDebitos?CNPJ=33200056000149');

    expect(res.status).toBe(400);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body['error']).toContain('UF');

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('Historico retorna 200 e persiste com param ConsultaUid', async () => {
    const res = await app.request('/api/directdata/Historico?ConsultaUid=abc-123');

    expect(res.status).toBe(200);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway: 'directdata',
        fonte: 'Historico',
        tipo_param: 'consultauid',
        param: 'abc-123',
        status: 'success',
      }),
    );
  });
});
