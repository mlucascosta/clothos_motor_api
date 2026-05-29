import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { AutenticacaoDto } from '../dtos/v2/CertificadoDto.js';

export interface ICriarAutenticacaoCertificado {
  execute(input: { id: number; tipo: string; valor?: string }): Promise<
    Either<SourceError, AutenticacaoDto>
  >;
}
