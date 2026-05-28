import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type CertificadoDto, CertificadoDtoSchema } from '../../dtos/v2/CertificadoDto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface ICriarCertificado {
  execute(input: { nome: string; arquivo_base64: string; senha: string }): Promise<
    Either<SourceError, CertificadoDto>
  >;
}

export class CriarCertificado implements ICriarCertificado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { nome: string; arquivo_base64: string; senha: string }): Promise<
    Either<SourceError, CertificadoDto>
  > {
    const result = await this.http.request<unknown>('/api/v2/certificados', {
      method: 'POST',
      body: { nome: input.nome, arquivo_base64: input.arquivo_base64, senha: input.senha },
    });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(CertificadoDtoSchema, result.value, 'escavador-v2');
  }
}
