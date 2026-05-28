import { z } from 'zod';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

const OrigemMonitoramentoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  estado: z.string().optional(),
  tipo: z.string().optional(),
});

const OrigensMonitoramentoResponseSchema = z.object({
  items: z.array(OrigemMonitoramentoSchema),
  total: z.number().int().min(0).optional(),
});

export type OrigensMonitoramentoResponse = z.infer<typeof OrigensMonitoramentoResponseSchema>;

export interface IObterOrigensMonitoramento {
  execute(input: { id: number }): Promise<Either<SourceError, OrigensMonitoramentoResponse>>;
}

export class ObterOrigensMonitoramento implements IObterOrigensMonitoramento {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, OrigensMonitoramentoResponse>> {
    const result = await this.http.request<unknown>(`/api/v1/monitoramentos/${input.id}/origens`);
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(OrigensMonitoramentoResponseSchema, result.value, 'escavador');
  }
}
