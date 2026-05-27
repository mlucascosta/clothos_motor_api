import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type AutenticacaoDto, AutenticacaoDtoSchema } from '../../dtos/v2/CertificadoDto.js';

export interface ICriarAutenticacaoCertificado {
  execute(input: { id: number; tipo: string; valor?: string }): Promise<
    Either<SourceError, AutenticacaoDto>
  >;
}

export class CriarAutenticacaoCertificado implements ICriarAutenticacaoCertificado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number; tipo: string; valor?: string }): Promise<
    Either<SourceError, AutenticacaoDto>
  > {
    const body: Record<string, unknown> = { tipo: input.tipo };
    if (input.valor !== undefined) body['valor'] = input.valor;

    const result = await this.http.request<unknown>(
      `/api/v2/certificados/${input.id}/autenticacoes`,
      {
        method: 'POST',
        body,
      },
    );
    if (result._tag === 'Left') return result;
    const parsed = AutenticacaoDtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
