import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type EnvolvidosV2Response,
  EnvolvidosV2ResponseSchema,
} from '../../dtos/v2/ProcessoV2Dto.js';
import type { IObterEnvolvidosProcessoV2 } from '../../ports/IObterEnvolvidosProcessoV2.js';

export class ObterEnvolvidosProcessoV2 implements IObterEnvolvidosProcessoV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string }): Promise<Either<SourceError, EnvolvidosV2Response>> {
    const result = await this.http.request<unknown>(
      `/api/v2/processos/numero_cnj/${encodeURIComponent(input.numero_cnj)}/envolvidos`,
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(EnvolvidosV2ResponseSchema, result.value, 'escavador-v2');
  }
}
