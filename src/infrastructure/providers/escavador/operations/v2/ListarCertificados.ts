import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type ListarCertificadosResponse,
  ListarCertificadosResponseSchema,
} from '../../dtos/v2/CertificadoDto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IListarCertificados {
  execute(): Promise<Either<SourceError, ListarCertificadosResponse>>;
}

export class ListarCertificados implements IListarCertificados {
  constructor(private readonly http: IHttpClient) {}

  async execute(): Promise<Either<SourceError, ListarCertificadosResponse>> {
    const result = await this.http.request<unknown>('/api/v2/certificados');
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ListarCertificadosResponseSchema, result.value, 'escavador-v2');
  }
}
