// POST /api/v1/processos/tribunal/oab  (ASYNC — retorna ID para polling)
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessosOabInput {
  oab: string;
  tribunais?: string[];
}

export interface IIniciarBuscaProcessosOab {
  execute(input: IniciarBuscaProcessosOabInput): Promise<Either<SourceError, IniciarBuscaResponse>>;
}
