import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type CallbackV2Dto, CallbackV2DtoSchema } from '../../dtos/v2/CallbackV2Dto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IReenviarCallbackV2 } from '../../ports/IReenviarCallbackV2.js';

export class ReenviarCallbackV2 implements IReenviarCallbackV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, CallbackV2Dto>> {
    const result = await this.http.request<unknown>(`/api/v2/callbacks/${input.id}/reenviar`, {
      method: 'POST',
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(CallbackV2DtoSchema, result.value, 'escavador-v2');
  }
}
