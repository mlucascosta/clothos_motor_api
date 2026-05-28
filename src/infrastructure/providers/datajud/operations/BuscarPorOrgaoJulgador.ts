/**
 * @fileoverview Operação de busca por órgão julgador no DataJud.
 * Encapsula construção do DSL Elasticsearch para filtro de órgão julgador.
 * @module infrastructure/providers/datajud/operations/BuscarPorOrgaoJulgador
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { DataJudSearchResponseDto } from '../dtos/DataJudSearchResponseDto.js';
import { BuscarGenericoDataJud } from './BuscarGenericoDataJud.js';

export interface BuscarPorOrgaoJulgadorInput {
  sigla: string;
  orgaoJulgador: string;
  size?: number;
}

/**
 * Busca processos por órgão julgador.
 * Constrói o DSL Elasticsearch internamente via match no campo `orgaoJulgador.nome`.
 *
 * @class BuscarPorOrgaoJulgador
 */
export class BuscarPorOrgaoJulgador {
  private readonly buscar: BuscarGenericoDataJud;

  constructor(http: IHttpClient) {
    this.buscar = new BuscarGenericoDataJud(http);
  }

  async execute(input: BuscarPorOrgaoJulgadorInput): Promise<Either<SourceError, DataJudSearchResponseDto>> {
    return this.buscar.execute({
      sigla: input.sigla,
      body: {
        query: { match: { 'orgaoJulgador.nome': input.orgaoJulgador } },
        size: input.size,
      },
    });
  }
}
