// GET /api/v1/monitoramentos/{id}/aparicoes
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarAparicaoResponse } from '../dtos/MonitoramentoDto.js';

export interface ObterAparicoesInput {
  id: number;
  pagina?: number;
}

export interface IObterAparicoes {
  execute(input: ObterAparicoesInput): Promise<Either<SourceError, ListarAparicaoResponse>>;
}
