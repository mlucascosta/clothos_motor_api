import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ResumoProcessoV2Dto,
  ResumoProcessoV2DtoSchema,
} from '../../dtos/v2/ResumoProcessoV2Dto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IObterStatusResumoProcesso } from '../../ports/IObterStatusResumoProcesso.js';

export class ObterStatusResumoProcesso implements IObterStatusResumoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, ResumoProcessoV2Dto>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/${input.id}/resumo/status`);
    if (isLeft(result)) return result;
    return parseOrSchemaError(ResumoProcessoV2DtoSchema, result.value, 'escavador-v2');
  }
}
