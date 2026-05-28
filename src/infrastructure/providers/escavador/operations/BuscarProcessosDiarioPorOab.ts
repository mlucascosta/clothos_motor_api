import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { type BuscaGeralResponse, BuscaGeralResponseSchema } from '../dtos/BuscaGeralDto.js';
import type {
  BuscarProcessosDiarioPorOabInput,
  IBuscarProcessosDiarioPorOab,
} from '../ports/IBuscarProcessosDiarioPorOab.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

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

    return parseOrSchemaError(BuscaGeralResponseSchema, result.value, 'escavador');
  }
}
