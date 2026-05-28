import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type ProcessoEnvolvidosResponse,
  ProcessoEnvolvidosResponseSchema,
} from '../dtos/ProcessoEnvolvidosDto.js';
import type {
  IObterEnvolvidosProcesso,
  ObterEnvolvidosProcessoInput,
} from '../ports/IObterEnvolvidosProcesso.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export class ObterEnvolvidosProcesso implements IObterEnvolvidosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: ObterEnvolvidosProcessoInput,
  ): Promise<Either<SourceError, ProcessoEnvolvidosResponse>> {
    const result = await this.http.request<unknown>(
      `/api/v1/processos/${input.id}/envolvidos-diarios`,
    );

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(ProcessoEnvolvidosResponseSchema, result.value, 'escavador');
  }
}
