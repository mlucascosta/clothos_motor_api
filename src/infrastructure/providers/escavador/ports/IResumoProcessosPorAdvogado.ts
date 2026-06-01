import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ResumoAdvogado } from '../operations/v2/ResumoProcessosPorAdvogado.js';

export type { ResumoAdvogado };

export interface IResumoProcessosPorAdvogado {
  execute(input: { oab: string; oab_estado?: string }): Promise<
    Either<SourceError, ResumoAdvogado>
  >;
}
