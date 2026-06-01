/**
 * @fileoverview Port para operation CadastroEntidadesPrivadasImpedidas.
 * @module infrastructure/providers/directdata/ports/ICadastroEntidadesPrivadasImpedidas
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CadastroEntidadesPrivadasImpedidasRetornoDto } from '../dtos/CadastroEntidadesPrivadasImpedidasDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CadastroEntidadesPrivadasImpedidas.
 *
 * @interface ICadastroEntidadesPrivadasImpedidas
 */
export interface ICadastroEntidadesPrivadasImpedidas {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CadastroEntidadesPrivadasImpedidasRetornoDto | null;
      }
    >
  >;
}
