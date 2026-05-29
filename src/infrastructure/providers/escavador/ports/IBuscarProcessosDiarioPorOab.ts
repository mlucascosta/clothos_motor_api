// GET /api/v1/processos/diarios-oficiais/oab
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BuscaGeralResponse } from '../dtos/BuscaGeralDto.js';

export interface BuscarProcessosDiarioPorOabInput {
  oab: string;
}

export interface IBuscarProcessosDiarioPorOab {
  execute(
    input: BuscarProcessosDiarioPorOabInput,
  ): Promise<Either<SourceError, BuscaGeralResponse>>;
}
