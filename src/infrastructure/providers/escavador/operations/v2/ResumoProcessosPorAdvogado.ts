import { z } from 'zod';
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IResumoProcessosPorAdvogado } from '../../ports/IResumoProcessosPorAdvogado.js';

const ResumoAdvogadoSchema = z.record(z.unknown());
export type ResumoAdvogado = z.infer<typeof ResumoAdvogadoSchema>;

export class ResumoProcessosPorAdvogado implements IResumoProcessosPorAdvogado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { oab: string; oab_estado?: string }): Promise<Either<SourceError, ResumoAdvogado>> {
    const result = await this.http.request<unknown>(`/api/v2/advogado/resumo`, {
      params: { oab_numero: input.oab, oab_estado: input.oab_estado },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ResumoAdvogadoSchema, result.value, 'escavador-v2');
  }
}
