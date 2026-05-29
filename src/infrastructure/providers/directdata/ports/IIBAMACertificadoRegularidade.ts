/**
 * @fileoverview Port para operation IBAMACertificadoRegularidade.
 * @module infrastructure/providers/directdata/ports/IIBAMACertificadoRegularidade
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { IBAMACertificadoRegularidadeRetornoDto } from '../dtos/IBAMACertificadoRegularidadeDto.js';

/**
 * Interface para consulta de IBAMACertificadoRegularidade.
 *
 * @interface IIBAMACertificadoRegularidade
 */
export interface IIBAMACertificadoRegularidade {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: IBAMACertificadoRegularidadeRetornoDto | null;
  }>>;
}
