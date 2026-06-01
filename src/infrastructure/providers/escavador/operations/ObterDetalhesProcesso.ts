import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type ProcessoDto, ProcessoDtoSchema } from '../dtos/ProcessoDto.js';
import type {
  IObterDetalhesProcesso,
  ObterDetalhesProcessoInput,
} from '../ports/IObterDetalhesProcesso.js';

export class ObterDetalhesProcesso implements IObterDetalhesProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: ObterDetalhesProcessoInput): Promise<Either<SourceError, ProcessoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/processos/${input.numeroCnj}`);

    if (isLeft(result)) return result;

    return parseOrSchemaError(ProcessoDtoSchema, result.value, 'escavador');
  }
}
