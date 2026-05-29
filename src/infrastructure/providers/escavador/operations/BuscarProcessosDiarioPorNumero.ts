import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { type BuscaGeralResponse, BuscaGeralResponseSchema } from '../dtos/BuscaGeralDto.js';
import type {
  BuscarProcessosDiarioPorNumeroInput,
  IBuscarProcessosDiarioPorNumero,
} from '../ports/IBuscarProcessosDiarioPorNumero.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export class BuscarProcessosDiarioPorNumero implements IBuscarProcessosDiarioPorNumero {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: BuscarProcessosDiarioPorNumeroInput,
  ): Promise<Either<SourceError, BuscaGeralResponse>> {
    const result = await this.http.request<unknown>('/api/v1/processos/diarios-oficiais/numero', {
      params: {
        numero: input.numero,
      },
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(BuscaGeralResponseSchema, result.value, 'escavador');
  }
}
