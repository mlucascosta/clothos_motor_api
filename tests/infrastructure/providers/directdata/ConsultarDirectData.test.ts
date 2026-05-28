/**
 * @fileoverview Testes unitários para a operação ConsultarDirectData.
 * @module tests/infrastructure/providers/directdata/ConsultarDirectData.test
 */

import { ConsultarDirectData } from '../../../../src/infrastructure/providers/directdata/operations/ConsultarDirectData';
import { isLeft, isRight } from '../../../../src/shared/domain/Either';

describe('ConsultarDirectData', () => {
  const mockHttp = {
    request: jest.fn(),
  };

  const operation = new ConsultarDirectData(
    mockHttp as unknown as import('../../../../src/shared/infrastructure/IHttpClient').IHttpClient,
  );

  beforeEach(() => {
    mockHttp.request.mockClear();
  });

  it('executa consulta com sucesso e valida schema', async () => {
    const mockResponse = {
      metaDados: {
        apiVersao: '1.0',
        resultado: 'SUCESSO',
        resultadoId: 1,
        consultaUid: 'abc-123',
        consultaNome: 'CadastroPessoaFisica',
        mensagem: 'Consulta realizada com sucesso',
        data: '2025-05-28T14:00:00',
        tempoExecucaoMs: 150,
      },
      retorno: {
        nome: 'JOAO SILVA',
        cpf: '52998224725',
      },
    };

    mockHttp.request.mockResolvedValue({ _tag: 'Right', value: mockResponse });

    const result = await operation.execute({
      path: '/api/CadastroPessoaFisica',
      params: { CPF: '52998224725' },
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.metaDados.resultado).toBe('SUCESSO');
      expect(result.value.retorno).toEqual({ nome: 'JOAO SILVA', cpf: '52998224725' });
    }

    expect(mockHttp.request).toHaveBeenCalledWith('/api/CadastroPessoaFisica', {
      method: 'GET',
      params: { CPF: '52998224725' },
    });
  });

  it('propaga erro quando http retorna Left', async () => {
    mockHttp.request.mockResolvedValue({
      _tag: 'Left',
      value: { kind: 'AUTH_FAILED', source: 'directdata', message: 'Unauthorized' },
    });

    const result = await operation.execute({
      path: '/api/CadastroPessoaFisica',
      params: { CPF: '52998224725' },
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('AUTH_FAILED');
    }
  });

  it('retorna SCHEMA_MISMATCH quando resposta não bate com schema', async () => {
    mockHttp.request.mockResolvedValue({
      _tag: 'Right',
      value: { invalidField: true },
    });

    const result = await operation.execute({
      path: '/api/CadastroPessoaFisica',
      params: { CPF: '52998224725' },
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('SCHEMA_MISMATCH');
    }
  });

  it('filtra parâmetros undefined e vazios', async () => {
    mockHttp.request.mockResolvedValue({
      _tag: 'Right',
      value: {
        metaDados: { resultado: 'SUCESSO', resultadoId: 1 },
        retorno: {},
      },
    });

    await operation.execute({
      path: '/api/CadastroPessoaFisica',
      params: { CPF: '52998224725', GERARCOMPROVANTE: undefined, NOME: '' },
    });

    expect(mockHttp.request).toHaveBeenCalledWith('/api/CadastroPessoaFisica', {
      method: 'GET',
      params: { CPF: '52998224725' },
    });
  });
});
