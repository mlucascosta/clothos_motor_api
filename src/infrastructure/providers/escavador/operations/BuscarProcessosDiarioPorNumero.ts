import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { type BuscaGeralResponse, BuscaGeralResponseSchema } from '../dtos/BuscaGeralDto.js';
import type {
  BuscarProcessosDiarioPorNumeroInput,
  IBuscarProcessosDiarioPorNumero,
} from '../ports/IBuscarProcessosDiarioPorNumero.js';

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

    if (result._tag === 'Left') return result;

    const parsed = BuscaGeralResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
