import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ResumoProcessoV2Dto } from '../dtos/v2/ResumoProcessoV2Dto.js';

export interface ISolicitarResumoProcesso {
  execute(input: { id: number }): Promise<Either<SourceError, ResumoProcessoV2Dto>>;
}
