import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type MovimentacoesV2Response,
  MovimentacoesV2ResponseSchema,
} from '../../dtos/v2/ProcessoV2Dto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IObterMovimentacoesV2 {
  execute(input: { numero_cnj: string; pagina?: number }): Promise<
    Either<SourceError, MovimentacoesV2Response>
  >;
}

export class ObterMovimentacoesV2 implements IObterMovimentacoesV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string; pagina?: number }): Promise<
    Either<SourceError, MovimentacoesV2Response>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/processos/numero_cnj/${encodeURIComponent(input.numero_cnj)}/movimentacoes`,
      { params },
    );
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(MovimentacoesV2ResponseSchema, result.value, 'escavador-v2');
  }
}
