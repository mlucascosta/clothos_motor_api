import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaLoteResponse,
  IniciarBuscaLoteResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcessosCpfCnpj,
  IniciarBuscaProcessosCpfCnpjInput,
} from '../ports/IIniciarBuscaProcessosCpfCnpj.js';

export class IniciarBuscaProcessosCpfCnpj implements IIniciarBuscaProcessosCpfCnpj {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessosCpfCnpjInput,
  ): Promise<Either<SourceError, IniciarBuscaLoteResponse>> {
    const body: Record<string, unknown> = {
      tipo: 'busca_por_documento',
      numero_documento: input.cpfCnpj,
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
