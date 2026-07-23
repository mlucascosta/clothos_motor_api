import type { SourceContext } from '@application/queries/ports/ISourceExecutor.js';
import { DirectDataExecutor } from '@infrastructure/providers/directdata/DirectDataExecutor.js';
import type { DirectDataExecutorDeps } from '@infrastructure/providers/directdata/DirectDataExecutor.js';
import type { IDirectDataOperation } from '@infrastructure/providers/directdata/ports/IDirectDataOperation.js';
import { isLeft, isRight, right } from '@shared/domain/Either.js';

function context(kind: SourceContext['identifierKind'], identifier: string): SourceContext {
  return {
    identifier,
    identifierKind: kind,
    tenantSlug: 'tenant_acme',
    correlationId: 'correlation-id',
    timeoutMs: 30_000,
  };
}

function op(): IDirectDataOperation<unknown> {
  return {
    execute: jest.fn().mockResolvedValue(right({ metaDados: { ok: true }, retorno: { x: 1 } })),
  } as unknown as IDirectDataOperation<unknown>;
}

function deps(): DirectDataExecutorDeps {
  return {
    cadastroPessoaFisica: op(),
    cadastroPessoaJuridica: op(),
    processosJudiciaisCompleta: op(),
  };
}

describe('DirectDataExecutor — dispatch por identifierKind', () => {
  it('CPF despacha para cadastroPessoaFisica', async () => {
    const d = deps();
    const result = await new DirectDataExecutor(d).execute(context('CPF', '11122233344'));

    expect(isRight(result)).toBe(true);
    expect(d.cadastroPessoaFisica.execute).toHaveBeenCalledWith({ CPF: '11122233344' });
  });

  it('CNPJ despacha para cadastroPessoaJuridica', async () => {
    const d = deps();
    await new DirectDataExecutor(d).execute(context('CNPJ', '55760212000169'));

    expect(d.cadastroPessoaJuridica.execute).toHaveBeenCalledWith({ CNPJ: '55760212000169' });
  });

  it('PROCESSO despacha para processosJudiciaisCompleta', async () => {
    const d = deps();
    await new DirectDataExecutor(d).execute(context('PROCESSO', '00000000000000000000'));

    expect(d.processosJudiciaisCompleta.execute).toHaveBeenCalledWith({
      PROCESSO: '00000000000000000000',
    });
  });

  it.each(['PLACA', 'CHASSI'] as const)(
    'RB-21: %s é declarado como NÃO suportado (falha fechado), sem chamar operação',
    async (kind) => {
      const d = deps();
      const result = await new DirectDataExecutor(d).execute(context(kind, 'ABC1D23'));

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.message).toContain('não suportado');
      }
      expect(d.cadastroPessoaFisica.execute).not.toHaveBeenCalled();
      expect(d.cadastroPessoaJuridica.execute).not.toHaveBeenCalled();
      expect(d.processosJudiciaisCompleta.execute).not.toHaveBeenCalled();
    },
  );
});
