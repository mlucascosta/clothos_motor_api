import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IObterInstituicao, ObterInstituicaoInput } from '../ports/IObterInstituicao.js';
import { InstituicaoDtoSchema, type InstituicaoDto } from '../dtos/InstituicaoDto.js';

export class ObterInstituicao implements IObterInstituicao {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: ObterInstituicaoInput): Promise<Either<SourceError, InstituicaoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/instituicoes/${input.id}`);

    if (result._tag === 'Left') return result;

    const parsed = InstituicaoDtoSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
