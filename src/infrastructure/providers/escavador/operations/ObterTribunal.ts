import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { TribunalDto } from '../dtos/TribunalDto.js';
import { TribunalDtoSchema } from '../dtos/TribunalDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export interface IObterTribunal {
  execute(input: { id: number }): Promise<Either<SourceError, TribunalDto>>;
}

export class ObterTribunal implements IObterTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, TribunalDto>> {
    const result = await this.http.request<unknown>(`/api/v1/tribunal/origens/${input.id}`);
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(TribunalDtoSchema, result.value, 'escavador');
  }
}
