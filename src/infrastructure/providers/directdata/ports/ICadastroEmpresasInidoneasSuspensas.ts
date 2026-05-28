/**
 * @fileoverview Port para operation CadastroEmpresasInidoneasSuspensas.
 * @module infrastructure/providers/directdata/ports/ICadastroEmpresasInidoneasSuspensas
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CadastroEmpresasInidoneasSuspensasRetornoDto } from '../dtos/CadastroEmpresasInidoneasSuspensasDto.js';

/**
 * Interface para consulta de CadastroEmpresasInidoneasSuspensas.
 *
 * @interface ICadastroEmpresasInidoneasSuspensas
 */
export interface ICadastroEmpresasInidoneasSuspensas {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CadastroEmpresasInidoneasSuspensasRetornoDto | null;
  }>>;
}
