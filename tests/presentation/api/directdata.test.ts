/**
 * @fileoverview Testes end-to-end (e2e) para rotas do DirectData refatorado.
 * Valida que o registry resolve operations e que rawStore persiste tudo.
 * @module tests/presentation/api/directdata.test
 */

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

describe('GET /api/directdata/:endpoint (DDD/SOLID)', () => {
  let saveSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  const mockSuccessResponse = {
    metaDados: {
      resultado: 'SUCESSO',
      resultadoId: 1,
      consultaUid: 'uid-test',
      consultaNome: 'Test',
      mensagem: 'Sucesso',
      data: '2025-05-28T14:00:00',
      tempoExecucaoMs: 150,
    },
    retorno: { data: 'value' },
  };

  beforeEach(() => {
    saveSpy = jest.spyOn(rawStore, 'save').mockImplementation(() => {});
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockSuccessResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  afterEach(() => {
    saveSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it('CadastroPessoaFisica: resolve operation via registry, retorna 200 e persiste no MongoDB', async () => {
    const res = await app.request('/api/directdata/CadastroPessoaFisica?CPF=11144477735');

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.metaDados).toBeDefined();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway: 'directdata',
        fonte: 'CadastroPessoaFisica',
        tipo_param: 'cpf',
        param: '11144477735',
        status: 'success',
      }),
    );

    const url = fetchSpy.mock.calls[0][0] as string;
    expect(url).toContain('TOKEN=');
    expect(url).toContain('CPF=11144477735');
  });

  it('CadastroPessoaJuridica: resolve operation via registry e persiste no MongoDB', async () => {
    const res = await app.request('/api/directdata/CadastroPessoaJuridica?CNPJ=33200056000149');

    expect(res.status).toBe(200);
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

  it('OFAC: resolve operation via registry e persiste no MongoDB', async () => {
    const res = await app.request('/api/directdata/OFAC?NOME=JOSE');

    expect(res.status).toBe(200);
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

  it('Historico/ObterRetornoConsultaAsync: resolve operation com path aninhado', async () => {
    const res = await app.request(
      '/api/directdata/Historico/ObterRetornoConsultaAsync?ConsultaUid=abc-123',
    );

    expect(res.status).toBe(200);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway: 'directdata',
        fonte: 'Historico/ObterRetornoConsultaAsync',
        status: 'success',
      }),
    );
  });

  it('retorna 500 e persiste erro quando upstream falha', async () => {
    fetchSpy.mockRestore();
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

    const res = await app.request('/api/directdata/CadastroPessoaFisica?CPF=11144477735');

    expect(res.status).toBe(500);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.error).toBeDefined();

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

  it('retorna 400 quando param obrigatório está ausente (Sintegra exige UF)', async () => {
    const res = await app.request('/api/directdata/Sintegra?CNPJ=33200056000149');

    expect(res.status).toBe(400);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.error).toContain('UF');

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('retorna 400 quando endpoint não existe', async () => {
    const res = await app.request('/api/directdata/EndpointInexistente');

    expect(res.status).toBe(400);
  });

  it('aceita CNPJ alfanumérico (12 alfanuméricos + 2 DV) sem 422', async () => {
    const res = await app.request('/api/directdata/CadastroPessoaJuridica?CNPJ=12ABC34501DE35');

    expect(res.status).toBe(200);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({ tipo_param: 'cnpj', param: '12ABC34501DE35' }),
    );
  });

  it('retorna 422 quando o documento tem formato inválido', async () => {
    const res = await app.request('/api/directdata/CadastroPessoaJuridica?CNPJ=123');

    expect(res.status).toBe(422);
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
