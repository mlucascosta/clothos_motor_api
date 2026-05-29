import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ProcessoV2Dto } from '../dtos/v2/ProcessoV2Dto.js';

export interface IObterProcessoPorCnj {
  execute(input: { numero: string }): Promise<Either<SourceError, ProcessoV2Dto>>;
}
