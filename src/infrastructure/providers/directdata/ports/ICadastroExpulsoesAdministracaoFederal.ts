/**
 * @fileoverview Port para operation CadastroExpulsoesAdministracaoFederal.
 * @module infrastructure/providers/directdata/ports/ICadastroExpulsoesAdministracaoFederal
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CadastroExpulsoesAdministracaoFederalRetornoDto } from '../dtos/CadastroExpulsoesAdministracaoFederalDto.js';

/**
 * Interface para consulta de CadastroExpulsoesAdministracaoFederal.
 *
 * @interface ICadastroExpulsoesAdministracaoFederal
 */
export interface ICadastroExpulsoesAdministracaoFederal {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CadastroExpulsoesAdministracaoFederalRetornoDto | null;
  }>>;
}
