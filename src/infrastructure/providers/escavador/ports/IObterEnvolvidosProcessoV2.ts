import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { EnvolvidosV2Response } from '../dtos/v2/ProcessoV2Dto.js';

export interface IObterEnvolvidosProcessoV2 {
  execute(input: { numero_cnj: string }): Promise<Either<SourceError, EnvolvidosV2Response>>;
}
