import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ListarCertificadosResponse } from '../dtos/v2/CertificadoDto.js';

export interface IListarCertificados {
  execute(): Promise<Either<SourceError, ListarCertificadosResponse>>;
}
