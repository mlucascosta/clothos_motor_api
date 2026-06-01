// POST /api/v1/tribunal/async/lote com tipo=busca_por_oab
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IniciarBuscaLoteResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessosOabInput {
  numero_oab: string;
  estado_oab: string;
  tribunais?: string[];
}

export interface IIniciarBuscaProcessosOab {
  execute(
    input: IniciarBuscaProcessosOabInput,
  ): Promise<Either<SourceError, IniciarBuscaLoteResponse>>;
}
