import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { EnvolvidosV2ResponseSchema, type EnvolvidosV2Response } from '../../dtos/v2/ProcessoV2Dto.js';

export interface IObterEnvolvidosProcessoV2 {
  execute(input: { numero_cnj: string }): Promise<Either<SourceError, EnvolvidosV2Response>>;
}

export class ObterEnvolvidosProcessoV2 implements IObterEnvolvidosProcessoV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string }): Promise<Either<SourceError, EnvolvidosV2Response>> {
    const result = await this.http.request<unknown>(
      `/api/v2/processos/${encodeURIComponent(input.numero_cnj)}/envolvidos`,
    );
    if (result._tag === 'Left') return result;
    const parsed = EnvolvidosV2ResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
