import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { BuscaEntidadeResponse } from '../dtos/EntidadeDto.js';

export interface BuscarEntidadeInput {
  query: string;
  tipo?: 'Pessoa' | 'Empresa';
  limit?: number;
}

export interface IBuscarEntidade {
  execute(input: BuscarEntidadeInput): Promise<Either<SourceError, BuscaEntidadeResponse>>;
}
