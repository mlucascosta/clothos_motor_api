import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { BuscaProcessosPorEnvolvidoResponse } from '../dtos/v2/ProcessoV2Dto.js';

export interface IBuscarProcessosPorEnvolvido {
  execute(input: { nome?: string; cpf_cnpj?: string; cursor?: string; li?: string }): Promise<
    Either<SourceError, BuscaProcessosPorEnvolvidoResponse>
  >;
}
