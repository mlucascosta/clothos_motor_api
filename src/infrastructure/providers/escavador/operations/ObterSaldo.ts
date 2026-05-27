import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { SaldoDto } from '../dtos/SaldoDto.js';
import { SaldoDtoSchema } from '../dtos/SaldoDto.js';

export interface IObterSaldo {
  execute(): Promise<Either<SourceError, SaldoDto>>;
}

export class ObterSaldo implements IObterSaldo {
  constructor(private readonly http: IHttpClient) {}

  async execute(): Promise<Either<SourceError, SaldoDto>> {
    const result = await this.http.request<unknown>('/api/v1/quantidade-creditos');
    if (result._tag === 'Left') return result;
    const parsed = SaldoDtoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
