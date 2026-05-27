import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { z } from 'zod';

const ResumoAdvogadoSchema = z.record(z.unknown());
type ResumoAdvogado = z.infer<typeof ResumoAdvogadoSchema>;

export interface IResumoProcessosPorAdvogado {
  execute(input: { oab: string }): Promise<Either<SourceError, ResumoAdvogado>>;
}

export class ResumoProcessosPorAdvogado implements IResumoProcessosPorAdvogado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { oab: string }): Promise<Either<SourceError, ResumoAdvogado>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/advogado/${encodeURIComponent(input.oab)}/resumo`);
    if (result._tag === 'Left') return result;
    const parsed = ResumoAdvogadoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
