/**
 * @fileoverview Mapper de processos jurídicos Escavador.
 * Transforma DTO da API (snake_case) para representação interna (camelCase).
 * @module infrastructure/providers/escavador/mappers/ProcessoMapper
 */

import type { ProcessoDto } from '../dtos/ProcessoDto.js';

/**
 * Representação interna de processo jurídico.
 * Normaliza nomenclatura para camelCase e estrutura de partes.
 *
 * @interface ProcessoInternal
 * @property {string} numeroCnj - Número CNJ do processo (identificador único)
 * @property {string} tribunal - Nome do tribunal (ex: "TJSP", "TST")
 * @property {string} [dataAjuizamento] - Data de ajuizamento (ISO 8601 ou local)
 * @property {string} [tipoAcao] - Classificação (ex: "Ação Ordinária", "Recurso")
 * @property {number} [valorCausa] - Valor da causa em reais
 * @property {boolean} ativo - Se processo está ativo (true) ou encerrado (false)
 * @property {Array<{ nome: string; tipoParte: string }>} partes - Partes envolvidas (autor, réu, etc.)
 * @property {string} [ultimaMovimentacao] - Descrição ou data da última movimentação
 */
export interface ProcessoInternal {
  numeroCnj: string;
  tribunal: string;
  dataAjuizamento?: string;
  tipoAcao?: string;
  valorCausa?: number;
  ativo: boolean;
  partes: Array<{ nome: string; tipoParte: string }>;
  ultimaMovimentacao?: string;
}

/**
 * Mapper de ProcessoDto → ProcessoInternal.
 * Implementa padrão Mapper para separação entre API contract e domínio interno.
 *
 * @class ProcessoMapper
 */
export class ProcessoMapper {
  /**
   * Transforma DTO de processo em representação interna.
   * Normaliza nomenclatura (snake_case → camelCase).
   * Mapeia array de partes, normalizando nome e tipoParte.
   * Trata defaults: ativo (padrão true), partes (padrão []).
   *
   * @param {ProcessoDto} dto - DTO bruto da API Escavador
   * @returns {ProcessoInternal} Processo normalizado para uso interno
   */
  toInternal(dto: ProcessoDto): ProcessoInternal {
    const result: ProcessoInternal = {
      numeroCnj: dto.numero_cnj,
      tribunal: dto.tribunal,
      ativo: dto.ativo ?? true,
      partes: (dto.partes ?? []).map((p) => ({ nome: p.nome, tipoParte: p.tipo_parte })),
    };
    if (dto.data_ajuizamento !== undefined) result.dataAjuizamento = dto.data_ajuizamento;
    if (dto.tipo_acao !== undefined) result.tipoAcao = dto.tipo_acao;
    if (dto.valor_causa !== undefined) result.valorCausa = dto.valor_causa;
    if (dto.ultima_movimentacao !== undefined) result.ultimaMovimentacao = dto.ultima_movimentacao;
    return result;
  }
}
