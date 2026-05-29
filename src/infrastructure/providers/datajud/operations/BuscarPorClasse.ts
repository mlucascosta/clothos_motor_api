/**
 * @fileoverview Operação de busca por classe processual no DataJud.
 * Encapsula construção do DSL Elasticsearch para filtro de classe.
 * @module infrastructure/providers/datajud/operations/BuscarPorClasse
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { DataJudSearchResponseDto } from '../dtos/DataJudSearchResponseDto.js';
import { BuscarGenericoDataJud } from './BuscarGenericoDataJud.js';

export interface BuscarPorClasseInput {
  sigla: string;
  classeNome?: string;
  classeCodigo?: number;
  size?: number;
}

/**
 * Busca processos por classe processual (nome ou código TPU).
 * Constrói o DSL Elasticsearch internamente.
 *
 * @class BuscarPorClasse
 */
export class BuscarPorClasse {
  private readonly buscar: BuscarGenericoDataJud;

  constructor(http: IHttpClient) {
    this.buscar = new BuscarGenericoDataJud(http);
  }

  async execute(input: BuscarPorClasseInput): Promise<Either<SourceError, DataJudSearchResponseDto>> {
    const query: Record<string, unknown> =
      input.classeCodigo !== undefined
        ? { term: { 'classe.codigo': input.classeCodigo } }
        : { match: { classe: input.classeNome } };

    return this.buscar.execute({
      sigla: input.sigla,
      body: { query, size: input.size },
    });
  }
}
