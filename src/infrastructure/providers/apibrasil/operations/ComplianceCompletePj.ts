/**
 * @fileoverview Operation ComplianceCompletePj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ComplianceCompletePj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { ComplianceCompletePjSchema } from '../dtos/ComplianceCompletePjDto.js';
import type { ComplianceCompletePjDto } from '../dtos/ComplianceCompletePjDto.js';
import type { IComplianceCompletePj } from '../ports/IComplianceCompletePj.js';

export class ComplianceCompletePj implements IComplianceCompletePj {
  readonly path = '/compliance-complete-pj';
  readonly creditValue = 14.44;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ComplianceCompletePjDto>> {
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

    return parseOrSchemaError(ComplianceCompletePjSchema, result.value, 'apibrasil');
  }
}
