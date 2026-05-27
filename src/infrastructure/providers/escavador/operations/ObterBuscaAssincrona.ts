import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { BuscaAssincronaDto } from '../dtos/BuscaAssincronaDto.js';
import { BuscaAssincronaDtoSchema } from '../dtos/BuscaAssincronaDto.js';

export interface IObterBuscaAssincrona {
  execute(input: { id: number }): Promise<Either<SourceError, BuscaAssincronaDto>>;
}

export class ObterBuscaAssincrona implements IObterBuscaAssincrona {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, BuscaAssincronaDto>> {
    const result = await this.http.request<unknown>(`/api/v1/async/resultados/${input.id}`);
    if (result._tag === 'Left') return result;
    const parsed = BuscaAssincronaDtoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
