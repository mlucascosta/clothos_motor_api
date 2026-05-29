import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type PessoaProcessosResponse, PessoaProcessosResponseSchema } from '../dtos/PessoaDto.js';
import type {
  IObterProcessosInstituicao,
  ObterProcessosInstituicaoInput,
} from '../ports/IObterProcessosInstituicao.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';

export class ObterProcessosInstituicao implements IObterProcessosInstituicao {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: ObterProcessosInstituicaoInput,
  ): Promise<Either<SourceError, PessoaProcessosResponse>> {
    const result = await this.http.request<unknown>(`/api/v1/instituicoes/${input.id}/processos`, {
      params: {
        page: input.pagina,
      },
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(PessoaProcessosResponseSchema, result.value, 'escavador');
  }
}
