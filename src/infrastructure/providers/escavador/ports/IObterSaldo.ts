// GET /api/v1/saldo
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { SaldoDto } from '../dtos/SaldoDto.js';

export interface IObterSaldo {
  execute(): Promise<Either<SourceError, SaldoDto>>;
}
