import { ApiBrasilScoreQuodExecutor } from '@infrastructure/providers/apibrasil/ApiBrasilScoreQuodExecutor.js';
import type { IApiBrasilOperation } from '@infrastructure/providers/apibrasil/ports/IApiBrasilOperation.js';
import { isLeft, isRight, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

const context = {
  identifier: '39053344705',
  identifierKind: 'CPF' as const,
  tenantSlug: 'tenant_acme',
  correlationId: 'correlation-id',
  timeoutMs: 30_000,
};

describe('ApiBrasilScoreQuodExecutor', () => {
  it('executa o score QUOD por CPF', async () => {
    const scoreQuod = {
      execute: jest.fn().mockResolvedValue(right({ score: 720 })),
    } as unknown as IApiBrasilOperation;

    const result = await new ApiBrasilScoreQuodExecutor(scoreQuod).execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'apibrasil_score_quod',
        data: { score_quod: { score: 720 } },
        cost: 1,
      });
    }
    expect(scoreQuod.execute).toHaveBeenCalledWith({ cpf: context.identifier });
  });

  it('despacha CNPJ com o parâmetro cnpj no mesmo endpoint', async () => {
    const scoreQuod = {
      execute: jest.fn().mockResolvedValue(right({ score: 480 })),
    } as unknown as IApiBrasilOperation;

    const result = await new ApiBrasilScoreQuodExecutor(scoreQuod).execute({
      ...context,
      identifier: '55760212000169',
      identifierKind: 'CNPJ',
    });

    expect(isRight(result)).toBe(true);
    expect(scoreQuod.execute).toHaveBeenCalledWith({ cnpj: '55760212000169' });
  });

  it('falha fechado para identificadores que não sejam CPF/CNPJ', async () => {
    const scoreQuod = { execute: jest.fn() } as unknown as IApiBrasilOperation;

    const result = await new ApiBrasilScoreQuodExecutor(scoreQuod).execute({
      ...context,
      identifierKind: 'PROCESSO',
    });

    expect(isLeft(result)).toBe(true);
    expect(scoreQuod.execute).not.toHaveBeenCalled();
  });

  it('propaga falhas do provedor (inclui o guard error:true em HTTP 200)', async () => {
    const scoreQuod = {
      execute: jest
        .fn()
        .mockResolvedValue(
          left(new SourceError('UPSTREAM_ERROR', 'apibrasil', 'ApiBrasil retornou error=true')),
        ),
    } as unknown as IApiBrasilOperation;

    const result = await new ApiBrasilScoreQuodExecutor(scoreQuod).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
  });
});
