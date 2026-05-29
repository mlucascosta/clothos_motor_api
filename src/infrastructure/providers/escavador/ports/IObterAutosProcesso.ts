import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { AutosV2Response } from '../dtos/v2/ProcessoV2Dto.js';

export interface IObterAutosProcesso {
  execute(input: { numero_cnj: string; pagina?: number }): Promise<
    Either<SourceError, AutosV2Response>
  >;
}
