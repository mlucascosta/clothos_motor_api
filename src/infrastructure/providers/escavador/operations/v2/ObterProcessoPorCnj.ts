import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type ProcessoV2Dto, ProcessoV2DtoSchema } from '../../dtos/v2/ProcessoV2Dto.js';
import type { IObterProcessoPorCnj } from '../../ports/IObterProcessoPorCnj.js';

export class ObterProcessoPorCnj implements IObterProcessoPorCnj {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero: string }): Promise<Either<SourceError, ProcessoV2Dto>> {
    const result = await this.http.request<unknown>(
      `/api/v2/processos/numero_cnj/${encodeURIComponent(input.numero)}`,
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(ProcessoV2DtoSchema, result.value, 'escavador-v2');
  }
}
