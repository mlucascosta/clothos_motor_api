// GET /api/v1/busca?q=...
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { BuscaGeralResponse } from '../dtos/BuscaGeralDto.js';

export interface BuscarGeralInput {
  query: string;
  tipo?: 'pessoa' | 'processo' | 'instituicao';
  pagina?: number;
}

export interface IBuscarGeral {
  execute(input: BuscarGeralInput): Promise<Either<SourceError, BuscaGeralResponse>>;
}
