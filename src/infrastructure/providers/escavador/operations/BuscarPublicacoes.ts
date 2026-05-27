import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IBuscarPublicacoes, BuscarPublicacoesInput } from '../ports/IBuscarPublicacoes.js';
import { PublicacoesResponseSchema, type PublicacoesResponse } from '../dtos/PublicacaoDto.js';

export class BuscarPublicacoes implements IBuscarPublicacoes {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: BuscarPublicacoesInput): Promise<Either<SourceError, PublicacoesResponse>> {
    const result = await this.http.request<unknown>(
      `/api/v1/pessoas/${input.entidadeId}/publicacoes`,
      { params: { page: input.pagina } },
    );

    if (result._tag === 'Left') return result;

    const parsed = PublicacoesResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
