import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type CertificadoDto, CertificadoDtoSchema } from '../../dtos/v2/CertificadoDto.js';

export interface IObterCertificado {
  execute(input: { id: number }): Promise<Either<SourceError, CertificadoDto>>;
}

export class ObterCertificado implements IObterCertificado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, CertificadoDto>> {
    const result = await this.http.request<unknown>(`/api/v2/certificados/${input.id}`);
    if (result._tag === 'Left') return result;
    const parsed = CertificadoDtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
