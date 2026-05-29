/**
 * @fileoverview Operation ComplianceComplete — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ComplianceComplete
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { ComplianceCompleteSchema } from '../dtos/ComplianceCompleteDto.js';
import type { IComplianceComplete } from '../ports/IComplianceComplete.js';

export class ComplianceComplete implements IComplianceComplete {
  readonly path = '/compliance-complete';
  readonly creditValue = 14.44;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>> {
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

    return parseOrSchemaError(ComplianceCompleteSchema, result.value, 'apibrasil');
  }
}
