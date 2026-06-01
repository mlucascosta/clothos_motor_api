import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type DocumentosV2Response,
  DocumentosV2ResponseSchema,
} from '../../dtos/v2/ProcessoV2Dto.js';
import type { IObterDocumentosProcesso } from '../../ports/IObterDocumentosProcesso.js';

export class ObterDocumentosProcesso implements IObterDocumentosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string; pagina?: number }): Promise<
    Either<SourceError, DocumentosV2Response>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/processos/numero_cnj/${encodeURIComponent(input.numero_cnj)}/documentos-publicos`,
      { params },
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(DocumentosV2ResponseSchema, result.value, 'escavador-v2');
  }
}
