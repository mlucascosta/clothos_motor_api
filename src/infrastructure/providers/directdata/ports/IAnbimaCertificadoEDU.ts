/**
 * @fileoverview Port para operation AnbimaCertificadoEDU.
 * @module infrastructure/providers/directdata/ports/IAnbimaCertificadoEDU
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { AnbimaCertificadoEDURetornoDto } from '../dtos/AnbimaCertificadoEDUDto.js';

/**
 * Interface para consulta de AnbimaCertificadoEDU.
 *
 * @interface IAnbimaCertificadoEDU
 */
export interface IAnbimaCertificadoEDU {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: AnbimaCertificadoEDURetornoDto | null;
  }>>;
}
