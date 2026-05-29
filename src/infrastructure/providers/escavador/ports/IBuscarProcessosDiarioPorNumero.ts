// GET /api/v1/processos/diarios-oficiais/numero
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BuscaGeralResponse } from '../dtos/BuscaGeralDto.js';

export interface BuscarProcessosDiarioPorNumeroInput {
  numero: string;
}

export interface IBuscarProcessosDiarioPorNumero {
  execute(
    input: BuscarProcessosDiarioPorNumeroInput,
  ): Promise<Either<SourceError, BuscaGeralResponse>>;
}
