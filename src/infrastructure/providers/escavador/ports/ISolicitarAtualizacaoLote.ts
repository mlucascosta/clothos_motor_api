import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AtualizacaoLoteDto } from '../dtos/v2/AtualizacaoDto.js';

export interface ISolicitarAtualizacaoLote {
  execute(input: { processos: Array<{ numero_cnj: string }>; enviar_callback?: boolean }): Promise<
    Either<SourceError, AtualizacaoLoteDto>
  >;
}
