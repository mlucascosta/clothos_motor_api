import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IIniciarBuscaProcessosCpfCnpj, IniciarBuscaProcessosCpfCnpjInput } from '../ports/IIniciarBuscaProcessosCpfCnpj.js';
import { IniciarBuscaResponseSchema, type IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export class IniciarBuscaProcessosCpfCnpj implements IIniciarBuscaProcessosCpfCnpj {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: IniciarBuscaProcessosCpfCnpjInput): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const result = await this.http.request<unknown>('/api/v1/processos/pesquisar-por-cpf-cnpj', {
      method: 'POST',
      body: {
        cpf_cnpj: input.cpfCnpj,
        tribunais: input.tribunais,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = IniciarBuscaResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
