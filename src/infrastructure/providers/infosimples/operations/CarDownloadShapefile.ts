/**
 * @fileoverview Operation CarDownloadShapefile — Infosimples API.
 * Endpoint: POST consultas/car/download-shapefile
 * @module infrastructure/providers/infosimples/operations/CarDownloadShapefile
 */
import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { CarDownloadShapefileResponseSchema, type CarDownloadShapefileItem } from '../dtos/CarDownloadShapefileDto.js';

export class CarDownloadShapefile implements IInfosimplesOperation<CarDownloadShapefileItem> {
  readonly path = 'consultas/car/download-shapefile';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(CarDownloadShapefileResponseSchema, result.value, 'infosimples');
  }
}
