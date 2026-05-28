/**
 * @fileoverview Testes unitários para AbstractDirectDataOperation.
 * @module tests/infrastructure/providers/directdata/AbstractDirectDataOperation.test
 */

import { AbstractDirectDataOperation } from '../../../../src/infrastructure/providers/directdata/operations/AbstractDirectDataOperation';
import { isLeft, isRight } from '../../../../src/shared/domain/Either';

describe('AbstractDirectDataOperation', () => {
  const mockHttp = {
    request: jest.fn(),
  };

  class TestOperation extends AbstractDirectDataOperation {
    readonly path = '/api/Test';
  }

  let operation: TestOperation;

  beforeEach(() => {
    mockHttp.request.mockClear();
    operation = new TestOperation(
      mockHttp as unknown as import(
        '../../../../src/shared/infrastructure/IHttpClient',
      ).IHttpClient,
    );
  });

  it('executa request GET no path definido pela subclass', async () => {
    mockHttp.request.mockResolvedValue({
      _tag: 'Right',
      value: {
        metaDados: { resultado: 'SUCESSO' },
        retorno: { data: true },
      },
    });

    const result = await operation.execute({ params: { CPF: '123' } });

    expect(isRight(result)).toBe(true);
    expect(mockHttp.request).toHaveBeenCalledWith('/api/Test', {
      method: 'GET',
      params: { CPF: '123' },
    });
  });

  it('filtra parâmetros undefined e vazios', async () => {
    mockHttp.request.mockResolvedValue({
      _tag: 'Right',
      value: {
        metaDados: { resultado: 'SUCESSO' },
        retorno: null,
      },
    });

    await operation.execute({
      params: { CPF: '123', NOME: undefined, EMAIL: '' },
    });

    expect(mockHttp.request).toHaveBeenCalledWith('/api/Test', {
      method: 'GET',
      params: { CPF: '123' },
    });
  });

  it('propaga erro quando http retorna Left', async () => {
    mockHttp.request.mockResolvedValue({
      _tag: 'Left',
      value: { kind: 'TIMEOUT', source: 'directdata', message: 'timeout' },
    });

    const result = await operation.execute({ params: {} });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('TIMEOUT');
    }
  });

  it('retorna SCHEMA_MISMATCH quando resposta não bate com schema', async () => {
    mockHttp.request.mockResolvedValue({
      _tag: 'Right',
      value: { invalidField: true },
    });

    const result = await operation.execute({ params: {} });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('SCHEMA_MISMATCH');
    }
  });
});
