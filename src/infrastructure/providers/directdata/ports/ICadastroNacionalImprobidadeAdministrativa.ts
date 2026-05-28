/**
 * @fileoverview Port para operation CadastroNacionalImprobidadeAdministrativa.
 * @module infrastructure/providers/directdata/ports/ICadastroNacionalImprobidadeAdministrativa
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CadastroNacionalImprobidadeAdministrativaRetornoDto } from '../dtos/CadastroNacionalImprobidadeAdministrativaDto.js';

/**
 * Interface para consulta de CadastroNacionalImprobidadeAdministrativa.
 *
 * @interface ICadastroNacionalImprobidadeAdministrativa
 */
export interface ICadastroNacionalImprobidadeAdministrativa {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CadastroNacionalImprobidadeAdministrativaRetornoDto | null;
  }>>;
}
