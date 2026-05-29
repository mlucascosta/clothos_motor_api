import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type PublicacoesResponse, PublicacoesResponseSchema } from '../dtos/PublicacaoDto.js';
import type { BuscarPublicacoesInput, IBuscarPublicacoes } from '../ports/IBuscarPublicacoes.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';

export class BuscarPublicacoes implements IBuscarPublicacoes {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: BuscarPublicacoesInput): Promise<Either<SourceError, PublicacoesResponse>> {
    const result = await this.http.request<unknown>(
      `/api/v1/pessoas/${input.entidadeId}/publicacoes`,
      { params: { page: input.pagina } },
    );

    if (isLeft(result)) return result;

    return parseOrSchemaError(PublicacoesResponseSchema, result.value, 'escavador');
  }
}
