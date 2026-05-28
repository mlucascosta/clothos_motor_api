import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type CertificadoDto, CertificadoDtoSchema } from '../../dtos/v2/CertificadoDto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IObterCertificado {
  execute(input: { id: number }): Promise<Either<SourceError, CertificadoDto>>;
}

export class ObterCertificado implements IObterCertificado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, CertificadoDto>> {
    const result = await this.http.request<unknown>(`/api/v2/certificados/${input.id}`);
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(CertificadoDtoSchema, result.value, 'escavador-v2');
  }
}
