import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type ProcessoV2Dto, ProcessoV2DtoSchema } from '../../dtos/v2/ProcessoV2Dto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IObterProcessoPorCnj {
  execute(input: { numero: string }): Promise<Either<SourceError, ProcessoV2Dto>>;
}

export class ObterProcessoPorCnj implements IObterProcessoPorCnj {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero: string }): Promise<Either<SourceError, ProcessoV2Dto>> {
    const result = await this.http.request<unknown>(
      `/api/v2/processos/numero_cnj/${encodeURIComponent(input.numero)}`,
    );
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ProcessoV2DtoSchema, result.value, 'escavador-v2');
  }
}
