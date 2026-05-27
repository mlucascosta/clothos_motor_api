// POST /api/v1/processos/tribunal/lote  (ASYNC — retorna ID para polling)
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export interface LoteItem {
  cpfCnpj?: string;
  nome?: string;
  oab?: string;
}

export interface IniciarBuscaProcessosLoteInput {
  itens: LoteItem[];
  tribunais?: string[];
}

export interface IIniciarBuscaProcessosLote {
  execute(
    input: IniciarBuscaProcessosLoteInput,
  ): Promise<Either<SourceError, IniciarBuscaResponse>>;
}
