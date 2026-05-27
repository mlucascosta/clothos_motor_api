import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { ListarTribunaisV2ResponseSchema, type ListarTribunaisV2Response } from '../../dtos/v2/TribunalV2Dto.js';

export interface IListarTribunaisV2 {
  execute(input: { sistema_id?: number }): Promise<Either<SourceError, ListarTribunaisV2Response>>;
}

export class ListarTribunaisV2 implements IListarTribunaisV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { sistema_id?: number }): Promise<Either<SourceError, ListarTribunaisV2Response>> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.sistema_id !== undefined) params['sistema_id'] = input.sistema_id;

    const result = await this.http.request<unknown>('/api/v2/tribunais', { params });
    if (result._tag === 'Left') return result;
    const parsed = ListarTribunaisV2ResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
