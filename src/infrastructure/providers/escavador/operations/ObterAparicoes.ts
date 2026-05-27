import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarAparicaoResponse } from '../dtos/MonitoramentoDto.js';
import { ListarAparicaoResponseSchema } from '../dtos/MonitoramentoDto.js';

export interface IObterAparicoes {
  execute(input: { id: number; pagina?: number }): Promise<Either<SourceError, ListarAparicaoResponse>>;
}

export class ObterAparicoes implements IObterAparicoes {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number; pagina?: number }): Promise<Either<SourceError, ListarAparicaoResponse>> {
    const result = await this.http.request<unknown>(`/api/v1/monitoramentos/${input.id}/aparicoes`, {
      params: { page: input.pagina },
    });
    if (result._tag === 'Left') return result;
    const parsed = ListarAparicaoResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
