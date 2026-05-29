import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessoInput {
  numero_cnj: string;
}

export interface IIniciarBuscaProcesso {
  execute(input: IniciarBuscaProcessoInput): Promise<Either<SourceError, IniciarBuscaResponse>>;
}
