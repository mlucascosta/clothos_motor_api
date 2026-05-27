// POST /api/v1/processos/tribunal/envolvido  (ASYNC — retorna ID para polling)
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessosEnvolvidoInput {
  nome: string;
  tribunais?: string[];
}

export interface IIniciarBuscaProcessosEnvolvido {
  execute(
    input: IniciarBuscaProcessosEnvolvidoInput,
  ): Promise<Either<SourceError, IniciarBuscaResponse>>;
}
