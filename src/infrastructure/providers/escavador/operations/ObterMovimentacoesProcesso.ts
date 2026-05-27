import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type MovimentacoesResponse,
  MovimentacoesResponseSchema,
} from '../dtos/MovimentacaoDto.js';
import type {
  IObterMovimentacoesProcesso,
  ObterMovimentacoesProcessoInput,
} from '../ports/IObterMovimentacoesProcesso.js';

export class ObterMovimentacoesProcesso implements IObterMovimentacoesProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: ObterMovimentacoesProcessoInput,
  ): Promise<Either<SourceError, MovimentacoesResponse>> {
    const result = await this.http.request<unknown>(
      `/api/v1/processos/${input.numeroCnj}/movimentacoes-diarios`,
      {
        params: {
          page: input.pagina,
        },
      },
    );

    if (result._tag === 'Left') return result;

    const parsed = MovimentacoesResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
