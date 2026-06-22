/**
 * @fileoverview Operação de busca por envolvido (parte) no DataJud.
 *
 * ⚠️ LIMITAÇÃO DA API PÚBLICA DO CNJ: o índice Elasticsearch público do DataJud
 * **não expõe dados das partes** (removidos por privacidade). Os campos reais do
 * `_source` são: numeroProcesso, classe, orgaoJulgador, assuntos, movimentos,
 * grau, dataAjuizamento, tribunal, sistema, formato, nivelSigilo — não há
 * `partes.nome` nem `partes.documento`. Verificado contra resposta real em
 * 2026-06 (api_publica_tjsp).
 *
 * Consequência: buscar por nome/CPF/CNPJ aqui retornaria SEMPRE 0 hits
 * silenciosamente — o que faria o dossiê tratar "sem resultados" como "sem
 * processos" e potencialmente PULAR o Escavador (que é a fonte correta para
 * busca por envolvido). Para evitar esse falso-negativo, a operação retorna um
 * erro explícito em vez de emitir uma query inútil.
 *
 * @module infrastructure/providers/datajud/operations/BuscarPorEnvolvido
 */

import { type Either, left } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DataJudSearchResponseDto } from '../dtos/DataJudSearchResponseDto.js';

export interface BuscarPorEnvolvidoInput {
  sigla: string;
  nome?: string;
  cpfCnpj?: string;
  size?: number;
}

const UNSUPPORTED_MESSAGE =
  'A API pública do DataJud (CNJ) não expõe dados de partes — busca por nome/CPF/CNPJ não é suportada. Use o Escavador para busca judicial por envolvido.';

/**
 * Busca processos por envolvido (parte) — NÃO SUPORTADA pela API pública do CNJ.
 * Retorna sempre um erro explícito (ver nota do módulo).
 *
 * @class BuscarPorEnvolvido
 */
export class BuscarPorEnvolvido {
  async execute(
    _input: BuscarPorEnvolvidoInput,
  ): Promise<Either<SourceError, DataJudSearchResponseDto>> {
    return left(new SourceError('UPSTREAM_ERROR', 'datajud', UNSUPPORTED_MESSAGE));
  }
}
