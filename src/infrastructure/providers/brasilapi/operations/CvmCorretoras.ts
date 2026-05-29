import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CvmCorretoraListSchema } from '../dtos/CvmCorretoraDto.js';
import type { CvmCorretoraDto } from '../dtos/CvmCorretoraDto.js';
import type { ICvmCorretoras } from '../ports/ICvmCorretoras.js';

export class CvmCorretoras implements ICvmCorretoras {
  readonly path = '/cvm/corretoras/v1';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    _params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CvmCorretoraDto[]>> {
    const result = await this.http.request<unknown>(this.path);
    if (isLeft(result)) return result;
    return parseOrSchemaError(CvmCorretoraListSchema, result.value, 'brasilapi');
  }
}
