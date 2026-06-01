/**
 * @fileoverview Port para operation CVMComissaodeValoresMobiliarios.
 * @module infrastructure/providers/directdata/ports/ICVMComissaodeValoresMobiliarios
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CVMComissaodeValoresMobiliariosRetornoDto } from '../dtos/CVMComissaodeValoresMobiliariosDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CVMComissaodeValoresMobiliarios.
 *
 * @interface ICVMComissaodeValoresMobiliarios
 */
export interface ICVMComissaodeValoresMobiliarios {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CVMComissaodeValoresMobiliariosRetornoDto | null;
      }
    >
  >;
}
