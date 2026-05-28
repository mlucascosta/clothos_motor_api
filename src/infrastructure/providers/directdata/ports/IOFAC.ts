/**
 * @fileoverview Port para operation OFAC.
 * @module infrastructure/providers/directdata/ports/IOFAC
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { OFACRetornoDto } from '../dtos/OFACDto.js';

/**
 * Interface para consulta de OFAC.
 *
 * @interface IOFAC
 */
export interface IOFAC {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: OFACRetornoDto | null;
  }>>;
}
