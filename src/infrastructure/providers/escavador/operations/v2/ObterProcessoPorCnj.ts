import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type ProcessoV2Dto, ProcessoV2DtoSchema } from '../../dtos/v2/ProcessoV2Dto.js';

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
    const parsed = ProcessoV2DtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
