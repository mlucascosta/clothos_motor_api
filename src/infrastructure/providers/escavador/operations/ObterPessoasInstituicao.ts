import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type InstituicaoPessoasResponse,
  InstituicaoPessoasResponseSchema,
} from '../dtos/InstituicaoDto.js';
import type {
  IObterPessoasInstituicao,
  ObterPessoasInstituicaoInput,
} from '../ports/IObterPessoasInstituicao.js';

export class ObterPessoasInstituicao implements IObterPessoasInstituicao {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: ObterPessoasInstituicaoInput,
  ): Promise<Either<SourceError, InstituicaoPessoasResponse>> {
    const result = await this.http.request<unknown>(`/api/v1/instituicoes/${input.id}/pessoas`, {
      params: {
        page: input.pagina,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = InstituicaoPessoasResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
