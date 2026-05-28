/**
 * @fileoverview Port para operation CGUConsultoriaGeralUniao.
 * @module infrastructure/providers/directdata/ports/ICGUConsultoriaGeralUniao
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CGUConsultoriaGeralUniaoRetornoDto } from '../dtos/CGUConsultoriaGeralUniaoDto.js';

/**
 * Interface para consulta de CGUConsultoriaGeralUniao.
 *
 * @interface ICGUConsultoriaGeralUniao
 */
export interface ICGUConsultoriaGeralUniao {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CGUConsultoriaGeralUniaoRetornoDto | null;
  }>>;
}
