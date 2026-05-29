import { isLeft, left } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SourceError as SourceErrorType } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { RegistroBrSchema } from '../dtos/RegistroBrDto.js';
import type { RegistroBrDto } from '../dtos/RegistroBrDto.js';
import type { IRegistroBr } from '../ports/IRegistroBr.js';

export class RegistroBr implements IRegistroBr {
  readonly path = '/registrobr/v1/{domain}';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceErrorType, RegistroBrDto>> {
    const domain = params['domain'];
    if (!domain) {
      return left(new SourceError('UPSTREAM_ERROR', 'brasilapi', 'Parâmetro domain obrigatório'));
    }
    const resolvedPath = this.path.replace('{domain}', domain);
    const result = await this.http.request<unknown>(resolvedPath);
    if (isLeft(result)) return result;
    return parseOrSchemaError(RegistroBrSchema, result.value, 'brasilapi');
  }
}
