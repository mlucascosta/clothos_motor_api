import { FonteDataExecutor } from '@infrastructure/providers/fontedata/FonteDataExecutor.js';
import type { FonteDataQuery } from '@infrastructure/providers/fontedata/operations/FonteDataQuery.js';
import { isLeft, isRight, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

const context = {
  identifier: '55760212000169',
  identifierKind: 'CNPJ' as const,
  tenantSlug: 'tenant_acme',
  correlationId: 'correlation-id',
  timeoutMs: 30_000,
};

const cnpjParams = (ctx: { identifierKind: string; identifier: string }) =>
  ctx.identifierKind === 'CNPJ' ? { cnpj: ctx.identifier } : null;

function executor(op: Partial<FonteDataQuery<Record<string, unknown>>>): FonteDataExecutor {
  return new FonteDataExecutor(
    op as FonteDataQuery<Record<string, unknown>>,
    'fontedata_cnpj',
    cnpjParams,
  );
}

describe('FonteDataExecutor', () => {
  it('sucesso: devolve dados e o custo REAL em centavos do X-Request-Cost', async () => {
    const op = {
      execute: jest.fn().mockResolvedValue(
        right({ body: { razao_social: 'Acme Ltda' }, costCents: 16 }),
      ),
    };

    const result = await executor(op).execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'fontedata_cnpj',
        data: { razao_social: 'Acme Ltda' },
        cost: 1,
        costCents: 16,
      });
    }
    expect(op.execute).toHaveBeenCalledWith({ cnpj: context.identifier });
  });

  it('erro do provedor (402/503/timeout) é falha técnica — propaga o Left', async () => {
    const op = {
      execute: jest
        .fn()
        .mockResolvedValue(left(new SourceError('UPSTREAM_ERROR', 'fontedata', 'HTTP 402'))),
    };

    const result = await executor(op).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
  });

  it('404 é ausência VÁLIDA: sucesso com encontrado=false e custo zero', async () => {
    const op = {
      execute: jest.fn().mockResolvedValue(left(new SourceError('NOT_FOUND', 'fontedata'))),
    };

    const result = await executor(op).execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'fontedata_cnpj',
        data: { encontrado: false },
        cost: 1,
        costCents: 0,
      });
    }
  });

  it('payload inesperado (SCHEMA_MISMATCH da operação) é erro, não sucesso', async () => {
    const op = {
      execute: jest
        .fn()
        .mockResolvedValue(
          left(new SourceError('SCHEMA_MISMATCH', 'fontedata', 'payload inesperado')),
        ),
    };

    const result = await executor(op).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('SCHEMA_MISMATCH');
  });

  it('identificador incompatível falha fechado sem chamar o provider', async () => {
    const op = { execute: jest.fn() };

    const result = await executor(op).execute({ ...context, identifierKind: 'PROCESSO' });

    expect(isLeft(result)).toBe(true);
    expect(op.execute).not.toHaveBeenCalled();
  });
});
