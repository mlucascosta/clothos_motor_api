/**
 * @fileoverview Port para operation HistoricoAlteracoesEmpresa.
 * @module infrastructure/providers/apibrasil/ports/IHistoricoAlteracoesEmpresa
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { HistoricoAlteracoesEmpresaDto } from '../dtos/HistoricoAlteracoesEmpresaDto.js';

export interface IHistoricoAlteracoesEmpresa {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, HistoricoAlteracoesEmpresaDto>>;
}
