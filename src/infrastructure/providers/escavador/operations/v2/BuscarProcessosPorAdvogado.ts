import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type ProcessoV2Resumo, ProcessoV2ResumoSchema } from '../../dtos/v2/ProcessoV2Dto.js';
import type { IBuscarProcessosPorAdvogado } from '../../ports/IBuscarProcessosPorAdvogado.js';

export class BuscarProcessosPorAdvogado implements IBuscarProcessosPorAdvogado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: {
    oab_numero: string;
    oab_estado?: string;
    oab_tipo?: string;
    pagina?: number;
  }): Promise<Either<SourceError, ProcessoV2Resumo>> {
    const params: Record<string, string | number | boolean | undefined> = {
      oab_numero: input.oab_numero,
      oab_estado: input.oab_estado,
      oab_tipo: input.oab_tipo,
      page: input.pagina,
    };
    const result = await this.http.request<unknown>('/api/v2/advogado/processos', { params });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ProcessoV2ResumoSchema, result.value, 'escavador-v2');
  }
}
