/**
 * @fileoverview Operation — Sefaz SPU / Dados de Imóveis
 * Endpoint: POST consultas/sefaz/spu/dados-imoveis
 * @module infrastructure/providers/infosimples/operations/SefazSpuDadosImoveis
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { SefazSpuDadosImoveisResponseSchema, type SefazSpuDadosImoveisItem } from '../dtos/SefazSpuDadosImoveisDto.js';

export class SefazSpuDadosImoveis implements IInfosimplesOperation<SefazSpuDadosImoveisItem> {
  readonly path = 'consultas/sefaz/spu/dados-imoveis';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, SefazSpuDadosImoveisItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(SefazSpuDadosImoveisResponseSchema, result.value, 'infosimples');
  }
}
