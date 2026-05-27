import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { AutosV2ResponseSchema, type AutosV2Response } from '../../dtos/v2/ProcessoV2Dto.js';

export interface IObterAutosProcesso {
  execute(input: { numero_cnj: string; pagina?: number }): Promise<Either<SourceError, AutosV2Response>>;
}

export class ObterAutosProcesso implements IObterAutosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string; pagina?: number }): Promise<Either<SourceError, AutosV2Response>> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/processos/${encodeURIComponent(input.numero_cnj)}/autos`,
      { params },
    );
    if (result._tag === 'Left') return result;
    const parsed = AutosV2ResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
