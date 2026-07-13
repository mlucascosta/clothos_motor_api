import { ApiBrasilExecutor } from '@infrastructure/providers/apibrasil/ApiBrasilExecutor.js';
import type { ICnpj } from '@infrastructure/providers/apibrasil/ports/ICnpj.js';
import { isLeft, isRight, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

const context = {
  identifier: '55760212000169',
  identifierKind: 'CNPJ' as const,
  tenantSlug: 'tenant_acme',
  correlationId: 'correlation-id',
  timeoutMs: 30_000,
};

describe('ApiBrasilExecutor', () => {
  it('executes the paid CNPJ source', async () => {
    const cnpj = {
      execute: jest.fn().mockResolvedValue(right({ cnpj: context.identifier })),
    } as unknown as ICnpj;

    const result = await new ApiBrasilExecutor(cnpj).execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'apibrasil',
        data: { cnpj: { cnpj: context.identifier } },
        cost: 1,
      });
    }
    expect(cnpj.execute).toHaveBeenCalledWith({ cnpj: context.identifier });
  });

  it('fails closed for identifiers other than CNPJ', async () => {
    const cnpj = { execute: jest.fn() } as unknown as ICnpj;

    const result = await new ApiBrasilExecutor(cnpj).execute({ ...context, identifierKind: 'CPF' });

    expect(isLeft(result)).toBe(true);
    expect(cnpj.execute).not.toHaveBeenCalled();
  });

  it('propagates provider failures', async () => {
    const cnpj = {
      execute: jest.fn().mockResolvedValue(left(new SourceError('RATE_LIMITED', 'apibrasil'))),
    } as unknown as ICnpj;

    const result = await new ApiBrasilExecutor(cnpj).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('RATE_LIMITED');
  });
});
