/**
 * @fileoverview Operation — Sefaz SPU / Certidão de Imóveis
 * Endpoint: POST consultas/sefaz/spu/certidao-imoveis
 * @module infrastructure/providers/infosimples/operations/SefazSpuCertidaoImoveis
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type SefazSpuCertidaoImoveisItem,
  SefazSpuCertidaoImoveisResponseSchema,
} from '../dtos/SefazSpuCertidaoImoveisDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class SefazSpuCertidaoImoveis implements IInfosimplesOperation<SefazSpuCertidaoImoveisItem> {
  readonly path = 'consultas/sefaz/spu/certidao-imoveis';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SefazSpuCertidaoImoveisItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(SefazSpuCertidaoImoveisResponseSchema, result.value, 'infosimples');
  }
}
