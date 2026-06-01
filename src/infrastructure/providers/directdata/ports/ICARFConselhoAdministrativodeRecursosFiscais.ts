/**
 * @fileoverview Port para operation CARFConselhoAdministrativodeRecursosFiscais.
 * @module infrastructure/providers/directdata/ports/ICARFConselhoAdministrativodeRecursosFiscais
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CARFConselhoAdministrativodeRecursosFiscaisRetornoDto } from '../dtos/CARFConselhoAdministrativodeRecursosFiscaisDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CARFConselhoAdministrativodeRecursosFiscais.
 *
 * @interface ICARFConselhoAdministrativodeRecursosFiscais
 */
export interface ICARFConselhoAdministrativodeRecursosFiscais {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CARFConselhoAdministrativodeRecursosFiscaisRetornoDto | null;
      }
    >
  >;
}
