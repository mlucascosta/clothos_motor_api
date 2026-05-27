import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { type BuscaGeralResponse, BuscaGeralResponseSchema } from '../dtos/BuscaGeralDto.js';
import type {
  BuscarProcessosDiarioPorOabInput,
  IBuscarProcessosDiarioPorOab,
} from '../ports/IBuscarProcessosDiarioPorOab.js';

export class BuscarProcessosDiarioPorOab implements IBuscarProcessosDiarioPorOab {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: BuscarProcessosDiarioPorOabInput,
  ): Promise<Either<SourceError, BuscaGeralResponse>> {
    const result = await this.http.request<unknown>('/api/v1/processos/diarios-oficiais/oab', {
      params: {
        oab: input.oab,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = BuscaGeralResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
