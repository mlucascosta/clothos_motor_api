import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaLoteResponse,
  IniciarBuscaLoteResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcessosOab,
  IniciarBuscaProcessosOabInput,
} from '../ports/IIniciarBuscaProcessosOab.js';

export class IniciarBuscaProcessosOab implements IIniciarBuscaProcessosOab {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessosOabInput,
  ): Promise<Either<SourceError, IniciarBuscaLoteResponse>> {
    const body: Record<string, unknown> = {
      tipo: 'busca_por_oab',
      numero_oab: input.numero_oab,
      estado_oab: input.estado_oab,
    };
    if (input.tribunais !== undefined) body['tribunais'] = input.tribunais;

    const result = await this.http.request<unknown>('/api/v1/tribunal/async/lote', {
      method: 'POST',
      body,
    });

    if (result._tag === 'Left') return result;

    const parsed = IniciarBuscaLoteResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
