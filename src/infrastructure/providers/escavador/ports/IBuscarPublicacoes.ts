import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { PublicacoesResponse } from '../dtos/PublicacaoDto.js';

export interface BuscarPublicacoesInput {
  entidadeId: number;
  pagina?: number;
}

export interface IBuscarPublicacoes {
  execute(input: BuscarPublicacoesInput): Promise<Either<SourceError, PublicacoesResponse>>;
}
