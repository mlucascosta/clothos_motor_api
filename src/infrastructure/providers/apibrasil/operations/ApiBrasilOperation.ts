import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IApiBrasilOperation } from '../ports/IApiBrasilOperation.js';

export class ApiBrasilOperation implements IApiBrasilOperation {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;

  constructor(
    private readonly http: IHttpClient,
    config: { path: string; creditValue: number; type: string },
  ) {
    this.path = config.path;
    this.creditValue = config.creditValue;
    this.type = config.type;
  }

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      body: cleanParams,
    });

    if (isLeft(result)) return result;

    return result;
  }
}
