import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { CertificadoDto } from '../dtos/v2/CertificadoDto.js';

export interface ICriarCertificado {
  execute(input: { nome: string; arquivo_base64: string; senha: string }): Promise<
    Either<SourceError, CertificadoDto>
  >;
}
