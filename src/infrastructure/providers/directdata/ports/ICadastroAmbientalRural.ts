/**
 * @fileoverview Port para operation CadastroAmbientalRural.
 * @module infrastructure/providers/directdata/ports/ICadastroAmbientalRural
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CadastroAmbientalRuralRetornoDto } from '../dtos/CadastroAmbientalRuralDto.js';

/**
 * Interface para consulta de CadastroAmbientalRural.
 *
 * @interface ICadastroAmbientalRural
 */
export interface ICadastroAmbientalRural {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CadastroAmbientalRuralRetornoDto | null;
  }>>;
}
