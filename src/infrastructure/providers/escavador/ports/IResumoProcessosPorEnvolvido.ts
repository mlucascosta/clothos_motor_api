import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ResumoEnvolvido } from '../operations/v2/ResumoProcessosPorEnvolvido.js';

export type { ResumoEnvolvido };

export interface IResumoProcessosPorEnvolvido {
  execute(input: { nome?: string; cpf_cnpj?: string }): Promise<
    Either<SourceError, ResumoEnvolvido>
  >;
}
