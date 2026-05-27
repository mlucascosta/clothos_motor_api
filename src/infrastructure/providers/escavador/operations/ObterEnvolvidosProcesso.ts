import { type Either, left, right } from '../../../../shared/domain/Either.js';
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

export class ObterEnvolvidosProcesso implements IObterEnvolvidosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: ObterEnvolvidosProcessoInput,
  ): Promise<Either<SourceError, ProcessoEnvolvidosResponse>> {
    const result = await this.http.request<unknown>(
      `/api/v1/processos/${input.id}/envolvidos-diarios`,
    );

    if (result._tag === 'Left') return result;

    const parsed = ProcessoEnvolvidosResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
