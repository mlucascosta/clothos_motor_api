import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type AutosV2Response, AutosV2ResponseSchema } from '../../dtos/v2/ProcessoV2Dto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IObterAutosProcesso } from '../../ports/IObterAutosProcesso.js';

export class ObterAutosProcesso implements IObterAutosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string; pagina?: number }): Promise<
    Either<SourceError, AutosV2Response>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/processos/${encodeURIComponent(input.numero_cnj)}/autos`,
      { params },
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(AutosV2ResponseSchema, result.value, 'escavador-v2');
  }
}
