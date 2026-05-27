import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { ListarCertificadosResponseSchema, type ListarCertificadosResponse } from '../../dtos/v2/CertificadoDto.js';

export interface IListarCertificados {
  execute(): Promise<Either<SourceError, ListarCertificadosResponse>>;
}

export class ListarCertificados implements IListarCertificados {
  constructor(private readonly http: IHttpClient) {}

  async execute(): Promise<Either<SourceError, ListarCertificadosResponse>> {
    const result = await this.http.request<unknown>('/api/v2/certificados');
    if (result._tag === 'Left') return result;
    const parsed = ListarCertificadosResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
