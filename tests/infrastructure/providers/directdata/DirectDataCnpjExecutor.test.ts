import { DirectDataCnpjExecutor } from '@infrastructure/providers/directdata/DirectDataCnpjExecutor.js';
import type { IDirectDataOperation } from '@infrastructure/providers/directdata/ports/IDirectDataOperation.js';
import { isLeft, isRight, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

const context = {
  identifier: '55760212000169',
  identifierKind: 'CNPJ' as const,
  tenantSlug: 'tenant_acme',
  correlationId: 'correlation-id',
  timeoutMs: 30_000,
};

describe('DirectDataCnpjExecutor', () => {
  it('executa a operação passando o CNPJ como parâmetro', async () => {
    const operation = {
      execute: jest
        .fn()
        .mockResolvedValue(
          right({ metaDados: { informacoesConsulta: {} }, retorno: { processos: [] } }),
        ),
    } as unknown as IDirectDataOperation<unknown>;

    const result = await new DirectDataCnpjExecutor(operation, 'directdata_processos').execute(
      context,
    );

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'directdata_processos',
        data: { metaDados: { informacoesConsulta: {} }, retorno: { processos: [] } },
        cost: 1,
      });
    }
    expect(operation.execute).toHaveBeenCalledWith({ CNPJ: context.identifier });
  });

  it('normaliza retorno nulo para null', async () => {
    const operation = {
      execute: jest.fn().mockResolvedValue(right({ metaDados: {}, retorno: null })),
    } as unknown as IDirectDataOperation<unknown>;

    const result = await new DirectDataCnpjExecutor(operation, 'directdata_processos').execute(
      context,
    );

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.data).toMatchObject({ retorno: null });
    }
  });

  it('falha fechado para identificador que não seja CNPJ', async () => {
    const operation = { execute: jest.fn() } as unknown as IDirectDataOperation<unknown>;

    const result = await new DirectDataCnpjExecutor(operation, 'directdata_processos').execute({
      ...context,
      identifierKind: 'CPF',
    });

    expect(isLeft(result)).toBe(true);
    expect(operation.execute).not.toHaveBeenCalled();
  });

  it('propaga falha do provider', async () => {
    const failure = new SourceError('UPSTREAM_ERROR', 'directdata', 'boom');
    const operation = {
      execute: jest.fn().mockResolvedValue(left(failure)),
    } as unknown as IDirectDataOperation<unknown>;

    const result = await new DirectDataCnpjExecutor(operation, 'directdata_processos').execute(
      context,
    );

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBe(failure);
    }
  });
});
