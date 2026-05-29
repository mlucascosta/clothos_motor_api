import { isLeft, left } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SourceError as SourceErrorType } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CvmCorretoraSchema } from '../dtos/CvmCorretoraDto.js';
import type { CvmCorretoraDto } from '../dtos/CvmCorretoraDto.js';
import type { ICvmCorretora } from '../ports/ICvmCorretora.js';

export class CvmCorretora implements ICvmCorretora {
  readonly path = '/cvm/corretoras/v1/{cnpj}';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceErrorType, CvmCorretoraDto>> {
    const cnpjRaw = params['cnpj'];
    if (!cnpjRaw) {
      return left(new SourceError('UPSTREAM_ERROR', 'brasilapi', 'Parâmetro cnpj obrigatório'));
    }
    const digits = cnpjRaw.replace(/\D/g, '');
    const resolvedPath = this.path.replace('{cnpj}', digits);
    const result = await this.http.request<unknown>(resolvedPath);
    if (isLeft(result)) return result;
    return parseOrSchemaError(CvmCorretoraSchema, result.value, 'brasilapi');
  }
}
