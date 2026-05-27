import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type ProcessoV2Resumo, ProcessoV2ResumoSchema } from '../../dtos/v2/ProcessoV2Dto.js';

export interface IBuscarProcessosPorAdvogado {
  execute(input: { oab: string; pagina?: number }): Promise<Either<SourceError, ProcessoV2Resumo>>;
}

export class BuscarProcessosPorAdvogado implements IBuscarProcessosPorAdvogado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { oab: string; pagina?: number }): Promise<
    Either<SourceError, ProcessoV2Resumo>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/processos/advogado/${encodeURIComponent(input.oab)}`,
      { params },
    );
    if (result._tag === 'Left') return result;
    const parsed = ProcessoV2ResumoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
