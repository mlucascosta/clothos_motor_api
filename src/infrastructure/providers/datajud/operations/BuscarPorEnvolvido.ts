/**
 * @fileoverview Operação de busca por envolvido (parte) no DataJud.
 * Encapsula construção do DSL Elasticsearch para filtro de nome ou CPF/CNPJ.
 * @module infrastructure/providers/datajud/operations/BuscarPorEnvolvido
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { DataJudSearchResponseDto } from '../dtos/DataJudSearchResponseDto.js';
import { BuscarGenericoDataJud } from './BuscarGenericoDataJud.js';

export interface BuscarPorEnvolvidoInput {
  sigla: string;
  nome?: string;
  cpfCnpj?: string;
  size?: number;
}

/**
 * Busca processos por envolvido (parte) — nome ou CPF/CNPJ.
 * Constrói DSL Elasticsearch com bool.must internamente.
 *
 * @class BuscarPorEnvolvido
 */
export class BuscarPorEnvolvido {
  private readonly buscar: BuscarGenericoDataJud;

  constructor(http: IHttpClient) {
    this.buscar = new BuscarGenericoDataJud(http);
  }

  async execute(input: BuscarPorEnvolvidoInput): Promise<Either<SourceError, DataJudSearchResponseDto>> {
    const must: Array<Record<string, unknown>> = [];
    if (input.nome) {
      must.push({ match: { 'partes.nome': input.nome } });
    }
    if (input.cpfCnpj) {
      must.push({ match: { 'partes.documento': input.cpfCnpj } });
    }

    return this.buscar.execute({
      sigla: input.sigla,
      body: {
        query: { bool: { must } },
        size: input.size,
      },
    });
  }
}
