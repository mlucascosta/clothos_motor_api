import { z } from 'zod';
import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

const ResumoAdvogadoSchema = z.record(z.unknown());
type ResumoAdvogado = z.infer<typeof ResumoAdvogadoSchema>;

export interface IResumoProcessosPorAdvogado {
  execute(input: { oab: string }): Promise<Either<SourceError, ResumoAdvogado>>;
}

export class ResumoProcessosPorAdvogado implements IResumoProcessosPorAdvogado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { oab: string }): Promise<Either<SourceError, ResumoAdvogado>> {
    const result = await this.http.request<unknown>(
      `/api/v2/processos/advogado/${encodeURIComponent(input.oab)}/resumo`,
    );
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ResumoAdvogadoSchema, result.value, 'escavador-v2');
  }
}
