import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ListarCertificadosResponse,
  ListarCertificadosResponseSchema,
} from '../../dtos/v2/CertificadoDto.js';
import type { IListarCertificados } from '../../ports/IListarCertificados.js';

export class ListarCertificados implements IListarCertificados {
  constructor(private readonly http: IHttpClient) {}

  async execute(): Promise<Either<SourceError, ListarCertificadosResponse>> {
    const result = await this.http.request<unknown>('/api/v2/certificados');
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarCertificadosResponseSchema, result.value, 'escavador-v2');
  }
}
