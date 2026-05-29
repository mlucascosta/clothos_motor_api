import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaLoteResponse } from '../dtos/BuscaAssincronaDto.js';

export type IniciarBuscaLoteInput =
  | { tipo: 'busca_por_documento'; cpfCnpj: string; tribunais?: string[] }
  | { tipo: 'busca_por_nome'; nome: string; tribunais?: string[] };

export interface IIniciarBuscaLote {
  execute(input: IniciarBuscaLoteInput): Promise<Either<SourceError, IniciarBuscaLoteResponse>>;
}
