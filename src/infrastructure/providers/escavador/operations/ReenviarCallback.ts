import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { CallbackDto } from '../dtos/CallbackDto.js';
import { CallbackDtoSchema } from '../dtos/CallbackDto.js';

export interface IReenviarCallback {
  execute(input: { id: number }): Promise<Either<SourceError, CallbackDto>>;
}

export class ReenviarCallback implements IReenviarCallback {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, CallbackDto>> {
    const result = await this.http.request<unknown>('/api/v1/callbacks/reenviar', {
      method: 'POST',
      body: { id: input.id },
    });
    if (result._tag === 'Left') return result;
    const parsed = CallbackDtoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
