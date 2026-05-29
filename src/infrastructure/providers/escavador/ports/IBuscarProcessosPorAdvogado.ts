import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ProcessoV2Resumo } from '../dtos/v2/ProcessoV2Dto.js';

export interface IBuscarProcessosPorAdvogado {
  execute(input: { oab_numero: string; oab_estado?: string; oab_tipo?: string; pagina?: number }): Promise<Either<SourceError, ProcessoV2Resumo>>;
}
