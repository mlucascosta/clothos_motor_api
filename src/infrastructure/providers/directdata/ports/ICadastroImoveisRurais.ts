/**
 * @fileoverview Port para operation CadastroImoveisRurais.
 * @module infrastructure/providers/directdata/ports/ICadastroImoveisRurais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CadastroImoveisRuraisRetornoDto } from '../dtos/CadastroImoveisRuraisDto.js';

/**
 * Interface para consulta de CadastroImoveisRurais.
 *
 * @interface ICadastroImoveisRurais
 */
export interface ICadastroImoveisRurais {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CadastroImoveisRuraisRetornoDto | null;
  }>>;
}
