import { isLeft, left } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SourceError as SourceErrorType } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CnpjSchema } from '../dtos/CnpjDto.js';
import type { CnpjDto } from '../dtos/CnpjDto.js';
import type { ICnpj } from '../ports/ICnpj.js';

export class Cnpj implements ICnpj {
  readonly path = '/cnpj/v1/{cnpj}';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceErrorType, CnpjDto>> {
    const cnpjRaw = params['cnpj'];
    if (!cnpjRaw) {
      return left(new SourceError('UPSTREAM_ERROR', 'brasilapi', 'Parâmetro cnpj obrigatório'));
    }
    const digits = cnpjRaw.replace(/\D/g, '');
    const resolvedPath = this.path.replace('{cnpj}', digits);
    const result = await this.http.request<unknown>(resolvedPath);
    if (isLeft(result)) return result;
    return parseOrSchemaError(CnpjSchema, result.value, 'brasilapi');
  }
}
