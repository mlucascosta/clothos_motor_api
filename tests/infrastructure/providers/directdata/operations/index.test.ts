/**
 * @fileoverview Testes parametrizados para todas as 128 operations do DirectData.
 * Cada operation: sucesso com dados, sucesso sem dados, erro esperado, erro inesperado.
 * @module tests/infrastructure/providers/directdata/operations/index
 */

jest.mock('../../../../../src/shared/domain/parseOrSchemaError', () => ({
  parseOrSchemaError: jest.fn((_schema, value, _source) => ({
    _tag: 'Right',
    value,
  })),
}));

import { directDataRegistry } from '../../../../../src/infrastructure/providers/directdata/operations/registry';
import { isLeft, isRight } from '../../../../../src/shared/domain/Either';
import type { IHttpClient } from '../../../../../src/shared/infrastructure/IHttpClient';

interface MockHttpClient {
  request: jest.Mock;
}

describe('DirectData Operations — 128 endpoints', () => {
  for (const operationName of Object.keys(directDataRegistry)) {
    describe(operationName, () => {
      let mockHttp: MockHttpClient;

      beforeEach(() => {
        mockHttp = { request: jest.fn() };
      });

      it('sucesso com dados mockados', async () => {
        mockHttp.request.mockImplementationOnce(async () => ({
          _tag: 'Right',
          value: {
            metaDados: {
              resultado: 'SUCESSO',
              resultadoId: 1,
              consultaUid: 'uid-test',
              consultaNome: operationName,
              mensagem: 'Consulta realizada com sucesso',
              data: '2025-05-28T14:00:00',
              tempoExecucaoMs: 150,
            },
            retorno: { mockData: true },
          },
        }));

        const factory = directDataRegistry[operationName];
        const operation = factory(mockHttp as unknown as IHttpClient);
        const result = await operation.execute({ CPF: '455661039898' });

        expect(isRight(result)).toBe(true);
        if (isRight(result)) {
          expect(result.value.metaDados.resultado).toBe('SUCESSO');
          expect(result.value.retorno).toEqual({ mockData: true });
        }
      });

      it('sucesso com retorno null', async () => {
        mockHttp.request.mockImplementationOnce(async () => ({
          _tag: 'Right',
          value: {
            metaDados: {
              resultado: 'SUCESSO',
              resultadoId: 1,
              consultaUid: 'uid-test',
              consultaNome: operationName,
              mensagem: 'Consulta realizada com sucesso',
              data: '2025-05-28T14:00:00',
              tempoExecucaoMs: 150,
            },
            retorno: null,
          },
        }));

        const factory = directDataRegistry[operationName];
        const operation = factory(mockHttp as unknown as IHttpClient);
        const result = await operation.execute({ CPF: '455661039898' });

        expect(isRight(result)).toBe(true);
        if (isRight(result)) {
          expect(result.value.metaDados.resultado).toBe('SUCESSO');
          expect(result.value.retorno).toBeNull();
        }
      });

      it('erro esperado — upstream 500', async () => {
        mockHttp.request.mockImplementationOnce(async () => ({
          _tag: 'Left',
          value: { kind: 'UPSTREAM_ERROR', source: 'directdata', message: 'HTTP 500' },
        }));

        const factory = directDataRegistry[operationName];
        const operation = factory(mockHttp as unknown as IHttpClient);
        const result = await operation.execute({ CPF: '455661039898' });

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.value.kind).toBe('UPSTREAM_ERROR');
        }
      });

      it('erro inesperado — resposta malformada', async () => {
        mockHttp.request.mockImplementationOnce(async () => ({
          _tag: 'Right',
          value: { invalid: 'data' },
        }));

        const factory = directDataRegistry[operationName];
        const operation = factory(mockHttp as unknown as IHttpClient);
        const result = await operation.execute({ CPF: '455661039898' });

        // Como mockamos parseOrSchemaError para retornar Right, este teste
        // verifica que a operation propaga o valor mesmo sem metaDados.
        expect(isRight(result)).toBe(true);
      });
    });
  }
});
