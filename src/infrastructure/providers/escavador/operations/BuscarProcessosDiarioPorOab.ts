import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IBuscarProcessosDiarioPorOab, BuscarProcessosDiarioPorOabInput } from '../ports/IBuscarProcessosDiarioPorOab.js';
import { BuscaGeralResponseSchema, type BuscaGeralResponse } from '../dtos/BuscaGeralDto.js';

export class BuscarProcessosDiarioPorOab implements IBuscarProcessosDiarioPorOab {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: BuscarProcessosDiarioPorOabInput): Promise<Either<SourceError, BuscaGeralResponse>> {
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
