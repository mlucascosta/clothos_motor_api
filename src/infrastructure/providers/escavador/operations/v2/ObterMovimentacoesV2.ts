import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { MovimentacoesV2ResponseSchema, type MovimentacoesV2Response } from '../../dtos/v2/ProcessoV2Dto.js';

export interface IObterMovimentacoesV2 {
  execute(input: { numero_cnj: string; pagina?: number }): Promise<Either<SourceError, MovimentacoesV2Response>>;
}

export class ObterMovimentacoesV2 implements IObterMovimentacoesV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string; pagina?: number }): Promise<Either<SourceError, MovimentacoesV2Response>> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/processos/movimentacoes/${encodeURIComponent(input.numero_cnj)}`,
      { params },
    );
    if (result._tag === 'Left') return result;
    const parsed = MovimentacoesV2ResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
