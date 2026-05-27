import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type CallbackV2Dto, CallbackV2DtoSchema } from '../../dtos/v2/CallbackV2Dto.js';

export interface IReenviarCallbackV2 {
  execute(input: { id: number }): Promise<Either<SourceError, CallbackV2Dto>>;
}

export class ReenviarCallbackV2 implements IReenviarCallbackV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, CallbackV2Dto>> {
    const result = await this.http.request<unknown>(`/api/v2/callbacks/${input.id}/reenviar`, {
      method: 'POST',
    });
    if (result._tag === 'Left') return result;
    const parsed = CallbackV2DtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
