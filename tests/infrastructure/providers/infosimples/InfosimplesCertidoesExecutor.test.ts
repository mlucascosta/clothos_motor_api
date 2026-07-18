import { InfosimplesCertidoesExecutor } from '@infrastructure/providers/infosimples/InfosimplesCertidoesExecutor.js';
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

function operation(value: unknown): IInfosimplesOperation {
  return { execute: jest.fn().mockResolvedValue(right(value)) } as unknown as IInfosimplesOperation;
}

describe('InfosimplesCertidoesExecutor', () => {
  it('combina PGFN e CNDT num único resultado com uma chave por certidão', async () => {
    const pgfn = operation({ data: [{ situacao: 'negativa' }] });
    const cndt = operation({ data: [{ situacao: 'nada consta' }] });

    const result = await new InfosimplesCertidoesExecutor(pgfn, cndt).execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'infosimples_certidoes',
        data: {
          pgfn: { data: [{ situacao: 'negativa' }] },
          cndt: { data: [{ situacao: 'nada consta' }] },
        },
        cost: 1,
      });
    }
    expect(pgfn.execute).toHaveBeenCalledWith({ cnpj: context.identifier });
    expect(cndt.execute).toHaveBeenCalledWith({ cnpj: context.identifier });
  });

  it('aceita CPF e envia o parâmetro cpf para as duas certidões', async () => {
    const pgfn = operation({ data: [] });
    const cndt = operation({ data: [] });

    const result = await new InfosimplesCertidoesExecutor(pgfn, cndt).execute({
      ...context,
      identifier: '39053344705',
      identifierKind: 'CPF',
    });

    expect(isRight(result)).toBe(true);
    expect(pgfn.execute).toHaveBeenCalledWith({ cpf: '39053344705' });
    expect(cndt.execute).toHaveBeenCalledWith({ cpf: '39053344705' });
  });

  it('falha fechado para identificadores que não sejam CPF/CNPJ', async () => {
    const pgfn = { execute: jest.fn() } as unknown as IInfosimplesOperation;
    const cndt = { execute: jest.fn() } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesCertidoesExecutor(pgfn, cndt).execute({
      ...context,
      identifierKind: 'PROCESSO',
    });

    expect(isLeft(result)).toBe(true);
    expect(pgfn.execute).not.toHaveBeenCalled();
    expect(cndt.execute).not.toHaveBeenCalled();
  });

  it('falha inteira quando qualquer certidão falha — parcial nunca vira sucesso', async () => {
    const pgfn = operation({ data: [] });
    const cndt = {
      execute: jest
        .fn()
        .mockResolvedValue(left(new SourceError('UPSTREAM_ERROR', 'infosimples', 'code=615'))),
    } as unknown as IInfosimplesOperation;

    const result = await new InfosimplesCertidoesExecutor(pgfn, cndt).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
  });
});
