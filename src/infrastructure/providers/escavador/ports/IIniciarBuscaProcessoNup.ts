// POST /api/v1/processos/administrativo/nup  (ASYNC — retorna ID para polling)
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessoNupInput {
  nup: string;
}

export interface IIniciarBuscaProcessoNup {
  execute(input: IniciarBuscaProcessoNupInput): Promise<Either<SourceError, IniciarBuscaResponse>>;
}
