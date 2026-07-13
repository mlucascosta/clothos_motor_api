import { InfosimplesExecutor } from '@infrastructure/providers/infosimples/InfosimplesExecutor.js';
import type { IInfosimplesOperation } from '@infrastructure/providers/infosimples/ports/IInfosimplesOperation.js';
import { isLeft, isRight, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

const context = {
  identifier: '55760212000169',
  identifierKind: 'CNPJ' as const,
  tenantSlug: 'tenant_acme',
  correlationId: 'correlation-id',
  timeoutMs: 30_000,
};

describe('InfosimplesExecutor', () => {
  it('executes the paid CNPJ source', async () => {
    const operation = {
      execute: jest.fn().mockResolvedValue(right({ data: [{ cnpj: context.identifier }] })),
    } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesExecutor(operation).execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'infosimples',
        data: { cnpj: { data: [{ cnpj: context.identifier }] } },
        cost: 1,
      });
    }
    expect(operation.execute).toHaveBeenCalledWith({ cnpj: context.identifier });
  });

  it('fails closed for identifiers other than CNPJ', async () => {
    const operation = { execute: jest.fn() } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesExecutor(operation).execute({
      ...context,
      identifierKind: 'CPF',
    });

    expect(isLeft(result)).toBe(true);
    expect(operation.execute).not.toHaveBeenCalled();
  });

  it('propagates provider failures', async () => {
    const operation = {
      execute: jest.fn().mockResolvedValue(left(new SourceError('RATE_LIMITED', 'infosimples'))),
    } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesExecutor(operation).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('RATE_LIMITED');
  });

  it('preserves the configured source code in execution results', async () => {
    const operation = {
      execute: jest.fn().mockResolvedValue(right({ data: [] })),
    } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesExecutor(operation, 'infosimples_ceis').execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) expect(result.value.source).toBe('infosimples_ceis');
  });
});
