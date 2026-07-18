import { InfosimplesCpfExecutor } from '@infrastructure/providers/infosimples/InfosimplesCpfExecutor.js';
import type { IInfosimplesOperation } from '@infrastructure/providers/infosimples/ports/IInfosimplesOperation.js';
import { isLeft, isRight, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

const context = {
  identifier: '39053344705',
  identifierKind: 'CPF' as const,
  tenantSlug: 'tenant_acme',
  correlationId: 'correlation-id',
  timeoutMs: 30_000,
};

describe('InfosimplesCpfExecutor', () => {
  it('executa a fonte CPF com o birthdate do subject_profile decifrado', async () => {
    const operation = {
      execute: jest.fn().mockResolvedValue(right({ data: [{ cpf: context.identifier }] })),
    } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesCpfExecutor(operation).execute({
      ...context,
      subjectProfile: { birthdate: '1990-01-31' },
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'infosimples_cpf',
        data: { cpf: { data: [{ cpf: context.identifier }] } },
        cost: 1,
      });
    }
    expect(operation.execute).toHaveBeenCalledWith({
      cpf: context.identifier,
      birthdate: '1990-01-31',
    });
  });

  it('sem subject_profile chama só com o CPF (endpoint responde erro de parâmetro)', async () => {
    const operation = {
      execute: jest.fn().mockResolvedValue(right({ data: [] })),
    } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesCpfExecutor(operation).execute(context);

    expect(isRight(result)).toBe(true);
    expect(operation.execute).toHaveBeenCalledWith({ cpf: context.identifier });
  });

  it('falha fechado para identificadores que não sejam CPF', async () => {
    const operation = { execute: jest.fn() } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesCpfExecutor(operation).execute({
      ...context,
      identifier: '55760212000169',
      identifierKind: 'CNPJ',
    });

    expect(isLeft(result)).toBe(true);
    expect(operation.execute).not.toHaveBeenCalled();
  });

  it('propaga falhas do provedor', async () => {
    const operation = {
      execute: jest.fn().mockResolvedValue(left(new SourceError('RATE_LIMITED', 'infosimples'))),
    } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesCpfExecutor(operation).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('RATE_LIMITED');
  });
});
