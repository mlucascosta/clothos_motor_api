// POST /api/v1/tribunal/async/lote — busca em múltiplos tribunais para um único critério
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IniciarBuscaLoteResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessosLoteInput {
  tipo: 'busca_por_nome' | 'busca_por_documento' | 'busca_por_oab';
  tribunais: string[];
  nome?: string;
  numero_documento?: string;
  numero_oab?: string;
  estado_oab?: string;
}

export interface IIniciarBuscaProcessosLote {
  execute(
    input: IniciarBuscaProcessosLoteInput,
  ): Promise<Either<SourceError, IniciarBuscaLoteResponse>>;
}
