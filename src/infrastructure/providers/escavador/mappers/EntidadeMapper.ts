/**
 * @fileoverview Mapper de entidades (pessoas/instituições) Escavador.
 * Transforma DTO da API (snake_case) para representação interna (camelCase).
 * @module infrastructure/providers/escavador/mappers/EntidadeMapper
 */

import type { EntidadeDto } from '../dtos/EntidadeDto.js';

/**
 * Representação interna de entidade (pessoa ou instituição).
 * Normaliza nomenclatura para camelCase e omite campos null/undefined.
 *
 * @interface EntidadeInternal
 * @property {number} id - ID único no Escavador
 * @property {string} nome - Nome da entidade (pessoa ou instituição)
 * @property {string} tipo - Tipo ('pessoa_fisica' ou 'instituicao')
 * @property {string} [documento] - CPF ou CNPJ (opcional)
 * @property {number} quantidadeProcessos - Total de processos associados
 * @property {string} [urlEscavador] - URL do perfil no Escavador (opcional)
 */
export interface EntidadeInternal {
  id: number;
  nome: string;
  tipo: string;
  documento?: string;
  quantidadeProcessos: number;
  urlEscavador?: string;
}

/**
 * Mapper de EntidadeDto → EntidadeInternal.
 * Implementa padrão Mapper para separação entre API contract e domínio interno.
 *
 * @class EntidadeMapper
 */
export class EntidadeMapper {
  /**
   * Transforma DTO da API em representação interna.
   * Normaliza nomenclatura (snake_case → camelCase).
   * Trata opcionais: documento (prefere CNPJ, fallback CPF), URL, quantidade_processos.
   *
   * @param {EntidadeDto} dto - DTO bruto da API Escavador
   * @returns {EntidadeInternal} Entidade normalizada para uso interno
   */
  toInternal(dto: EntidadeDto): EntidadeInternal {
    const result: EntidadeInternal = {
      id: dto.id,
      nome: dto.nome,
      tipo: dto.tipo,
      quantidadeProcessos: dto.quantidade_processos ?? 0,
    };
    const doc = dto.cnpj ?? dto.cpf;
    if (doc !== undefined) result.documento = doc;
    if (dto.url_escavador !== undefined) result.urlEscavador = dto.url_escavador;
    return result;
  }
}
