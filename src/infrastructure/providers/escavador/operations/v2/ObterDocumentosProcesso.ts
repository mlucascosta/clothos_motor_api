import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type DocumentosV2Response,
  DocumentosV2ResponseSchema,
} from '../../dtos/v2/ProcessoV2Dto.js';

export interface IObterDocumentosProcesso {
  execute(input: { numero_cnj: string; pagina?: number }): Promise<
    Either<SourceError, DocumentosV2Response>
  >;
}

export class ObterDocumentosProcesso implements IObterDocumentosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { numero_cnj: string; pagina?: number }): Promise<
    Either<SourceError, DocumentosV2Response>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/processos/${encodeURIComponent(input.numero_cnj)}/documentos`,
      { params },
    );
    if (result._tag === 'Left') return result;
    const parsed = DocumentosV2ResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
