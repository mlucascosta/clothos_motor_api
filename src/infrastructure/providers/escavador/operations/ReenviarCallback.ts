import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { CallbackDto } from '../dtos/CallbackDto.js';
import { CallbackDtoSchema } from '../dtos/CallbackDto.js';
import type { IReenviarCallback } from '../ports/IReenviarCallback.js';

export class ReenviarCallback implements IReenviarCallback {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, CallbackDto>> {
    const result = await this.http.request<unknown>('/api/v1/callbacks/reenviar', {
      method: 'POST',
      body: { id: input.id },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(CallbackDtoSchema, result.value, 'escavador');
  }
}
