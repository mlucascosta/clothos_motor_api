import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarOrigensDiariosResponse } from '../dtos/DiarioOficialDto.js';
import { ListarOrigensDiariosResponseSchema } from '../dtos/DiarioOficialDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IListarOrigensDiariosOficiais } from '../ports/IListarOrigensDiariosOficiais.js';

export class ListarOrigensDiariosOficiais implements IListarOrigensDiariosOficiais {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { estado?: string }): Promise<
    Either<SourceError, ListarOrigensDiariosResponse>
  > {
    const result = await this.http.request<unknown>('/api/v1/origens', {
      params: { estado: input.estado },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarOrigensDiariosResponseSchema, result.value, 'escavador');
  }
}
