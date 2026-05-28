/**
 * @fileoverview Port para operation ANTTConsultaRegularidadeTransportadora.
 * @module infrastructure/providers/directdata/ports/IANTTConsultaRegularidadeTransportadora
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ANTTConsultaRegularidadeTransportadoraRetornoDto } from '../dtos/ANTTConsultaRegularidadeTransportadoraDto.js';

/**
 * Interface para consulta de ANTTConsultaRegularidadeTransportadora.
 *
 * @interface IANTTConsultaRegularidadeTransportadora
 */
export interface IANTTConsultaRegularidadeTransportadora {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: ANTTConsultaRegularidadeTransportadoraRetornoDto | null;
  }>>;
}
