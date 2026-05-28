import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarAparicaoResponse } from '../dtos/MonitoramentoDto.js';
import { ListarAparicaoResponseSchema } from '../dtos/MonitoramentoDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export interface IObterAparicoes {
  execute(input: { id: number; pagina?: number }): Promise<
    Either<SourceError, ListarAparicaoResponse>
  >;
}

export class ObterAparicoes implements IObterAparicoes {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number; pagina?: number }): Promise<
    Either<SourceError, ListarAparicaoResponse>
  > {
    const result = await this.http.request<unknown>(
      `/api/v1/monitoramentos/${input.id}/aparicoes`,
      {
        params: { page: input.pagina },
      },
    );
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ListarAparicaoResponseSchema, result.value, 'escavador');
  }
}
