/**
 * @fileoverview Port para operation TJCertidaoCivelCriminalFiscal.
 * @module infrastructure/providers/directdata/ports/ITJCertidaoCivelCriminalFiscal
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TJCertidaoCivelCriminalFiscalRetornoDto } from '../dtos/TJCertidaoCivelCriminalFiscalDto.js';

/**
 * Interface para consulta de TJCertidaoCivelCriminalFiscal.
 *
 * @interface ITJCertidaoCivelCriminalFiscal
 */
export interface ITJCertidaoCivelCriminalFiscal {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: TJCertidaoCivelCriminalFiscalRetornoDto | null;
  }>>;
}
