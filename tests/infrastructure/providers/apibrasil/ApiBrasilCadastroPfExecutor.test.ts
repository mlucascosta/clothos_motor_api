import { ApiBrasilCadastroPfExecutor } from '@infrastructure/providers/apibrasil/ApiBrasilCadastroPfExecutor.js';
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

describe('ApiBrasilCadastroPfExecutor', () => {
  it('executa a fonte paga de cadastro PF por CPF', async () => {
    const cadastroPf = {
      execute: jest.fn().mockResolvedValue(right({ nome: 'Fulano de Tal' })),
    } as unknown as IApiBrasilOperation;

    const result = await new ApiBrasilCadastroPfExecutor(cadastroPf).execute(context);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toMatchObject({
        source: 'apibrasil_cadastro_pf',
        data: { cadastro_pf: { nome: 'Fulano de Tal' } },
        cost: 1,
      });
    }
    expect(cadastroPf.execute).toHaveBeenCalledWith({ cpf: context.identifier });
  });

  it('falha fechado para identificadores que não sejam CPF', async () => {
    const cadastroPf = { execute: jest.fn() } as unknown as IApiBrasilOperation;

    const result = await new ApiBrasilCadastroPfExecutor(cadastroPf).execute({
      ...context,
      identifier: '55760212000169',
      identifierKind: 'CNPJ',
    });

    expect(isLeft(result)).toBe(true);
    expect(cadastroPf.execute).not.toHaveBeenCalled();
  });

  it('propaga falhas do provedor (inclui o guard error:true em HTTP 200)', async () => {
    const cadastroPf = {
      execute: jest
        .fn()
        .mockResolvedValue(
          left(new SourceError('UPSTREAM_ERROR', 'apibrasil', 'ApiBrasil retornou error=true')),
        ),
    } as unknown as IApiBrasilOperation;

    const result = await new ApiBrasilCadastroPfExecutor(cadastroPf).execute(context);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
  });
});
