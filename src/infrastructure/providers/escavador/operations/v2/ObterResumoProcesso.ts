import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type ResumoProcessoV2Dto,
  ResumoProcessoV2DtoSchema,
} from '../../dtos/v2/ResumoProcessoV2Dto.js';

export interface IObterResumoProcesso {
  execute(input: { id: number }): Promise<Either<SourceError, ResumoProcessoV2Dto>>;
}

export class ObterResumoProcesso implements IObterResumoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, ResumoProcessoV2Dto>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/${input.id}/resumo`);
    if (result._tag === 'Left') return result;
    const parsed = ResumoProcessoV2DtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
