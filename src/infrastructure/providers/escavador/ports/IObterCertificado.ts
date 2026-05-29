import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CertificadoDto } from '../dtos/v2/CertificadoDto.js';

export interface IObterCertificado {
  execute(input: { id: number }): Promise<Either<SourceError, CertificadoDto>>;
}
