/**
 * @fileoverview Port para operation IBAMAConsultaAutuacoesAmbientais.
 * @module infrastructure/providers/directdata/ports/IIBAMAConsultaAutuacoesAmbientais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { IBAMAConsultaAutuacoesAmbientaisRetornoDto } from '../dtos/IBAMAConsultaAutuacoesAmbientaisDto.js';

/**
 * Interface para consulta de IBAMAConsultaAutuacoesAmbientais.
 *
 * @interface IIBAMAConsultaAutuacoesAmbientais
 */
export interface IIBAMAConsultaAutuacoesAmbientais {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: IBAMAConsultaAutuacoesAmbientaisRetornoDto | null;
  }>>;
}
