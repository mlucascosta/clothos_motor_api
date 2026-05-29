/**
 * @fileoverview Port para operation EnriquecimentoLead.
 * @module infrastructure/providers/directdata/ports/IEnriquecimentoLead
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { EnriquecimentoLeadRetornoDto } from '../dtos/EnriquecimentoLeadDto.js';

/**
 * Interface para consulta de EnriquecimentoLead.
 *
 * @interface IEnriquecimentoLead
 */
export interface IEnriquecimentoLead {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: EnriquecimentoLeadRetornoDto | null;
  }>>;
}
