/**
 * @fileoverview DTOs de processos jurídicos da API Escavador v2.
 * Define schemas de validação (Zod) para processos, partes, movimentações, documentos e autos.
 * @module infrastructure/providers/escavador/dtos/v2/ProcessoV2Dto
 */

import { z } from 'zod';

/**
 * Schema de parte envolvida em processo (autor, réu, etc.).
 *
 * @type {ZodSchema}
 */
export const EnvolvidoV2DtoSchema = z.object({
  /** ID único do envolvido */
  id: z.number().int().optional(),
  /** Nome completo da parte */
  nome: z.string(),
  /** Tipo de parte (autor, réu, assistente, etc.) */
  tipo: z.string().optional(),
  /** CPF ou CNPJ da parte */
  cpf_cnpj: z.string().optional(),
  /** Número de registro na OAB (se advogado) */
  oab: z.string().optional(),
});

/**
 * Schema de movimentação processual (evento no processo).
 *
 * @type {ZodSchema}
 */
export const MovimentacaoV2DtoSchema = z.object({
  /** ID único da movimentação */
  id: z.number().int().optional(),
  /** Data ISO 8601 da movimentação */
  data: z.string(),
  /** Descrição do evento */
  descricao: z.string(),
  /** Tipo/classificação da movimentação */
  tipo: z.string().optional(),
});

/**
 * Schema de documento anexado ao processo.
 *
 * @type {ZodSchema}
 */
export const DocumentoV2DtoSchema = z.object({
  /** ID único do documento */
  id: z.number().int(),
  /** Nome do documento */
  nome: z.string(),
  /** Tipo (petição, sentença, etc.) */
  tipo: z.string().optional(),
  /** URL para download */
  url: z.string().optional(),
});

/**
 * Schema de auto anexado ao processo.
 *
 * @type {ZodSchema}
 */
export const AutoV2DtoSchema = z.object({
  /** ID único do auto */
  id: z.number().int(),
  /** Descrição/nome do auto */
  nome: z.string(),
  /** Tipo de auto */
  tipo: z.string().optional(),
});

/**
 * Schema de processo jurídico da API v2.
 *
 * @type {ZodSchema}
 */
export const ProcessoV2DtoSchema = z.object({
  /** ID único do processo no Escavador */
  id: z.number().int().optional(),
  /** Número do processo no formato CNJ (00000000-00.0000.0.00.0000) */
  numero_cnj: z.string(),
  /** Nome do tribunal (TJSP, TRT, STF, etc.) */
  tribunal: z.string().optional(),
  /** Data de ajuizamento (ISO 8601) */
  data_ajuizamento: z.string().optional(),
  /** Partes envolvidas no processo */
  partes: z.array(EnvolvidoV2DtoSchema).optional(),
  /** Movimentações processuais */
  movimentacoes: z.array(MovimentacaoV2DtoSchema).optional(),
});

/**
 * Schema de resposta com resumo de processos.
 *
 * @type {ZodSchema}
 */
export const ProcessoV2ResumoSchema = z.object({
  /** Total de processos */
  total: z.number().int().min(0).optional(),
  /** Array de processos */
  items: z.array(ProcessoV2DtoSchema),
});

/**
 * Schema de resposta com movimentações.
 *
 * @type {ZodSchema}
 */
export const MovimentacoesV2ResponseSchema = z.object({
  /** Array de movimentações */
  items: z.array(MovimentacaoV2DtoSchema),
  /** Total de movimentações */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de resposta com partes envolvidas.
 *
 * @type {ZodSchema}
 */
export const EnvolvidosV2ResponseSchema = z.object({
  /** Array de partes */
  items: z.array(EnvolvidoV2DtoSchema),
  /** Total de partes */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de resposta com documentos.
 *
 * @type {ZodSchema}
 */
export const DocumentosV2ResponseSchema = z.object({
  /** Array de documentos */
  items: z.array(DocumentoV2DtoSchema),
  /** Total de documentos */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de resposta com autos.
 *
 * @type {ZodSchema}
 */
export const AutosV2ResponseSchema = z.object({
  /** Array de autos */
  items: z.array(AutoV2DtoSchema),
  /** Total de autos */
  total: z.number().int().min(0).optional(),
});

/**
 * Parte envolvida em processo jurídico.
 * Representa autor, réu, assistente, etc.
 *
 * @typedef {Object} EnvolvidoV2Dto
 */
export type EnvolvidoV2Dto = z.infer<typeof EnvolvidoV2DtoSchema>;

/**
 * Movimentação processual individual.
 * Evento que ocorreu no processo.
 *
 * @typedef {Object} MovimentacaoV2Dto
 */
export type MovimentacaoV2Dto = z.infer<typeof MovimentacaoV2DtoSchema>;

/**
 * Documento anexado ao processo.
 *
 * @typedef {Object} DocumentoV2Dto
 */
export type DocumentoV2Dto = z.infer<typeof DocumentoV2DtoSchema>;

/**
 * Auto anexado ao processo.
 *
 * @typedef {Object} AutoV2Dto
 */
export type AutoV2Dto = z.infer<typeof AutoV2DtoSchema>;

/**
 * Processo jurídico da API Escavador v2.
 * Contém informações básicas, partes e movimentações.
 *
 * @typedef {Object} ProcessoV2Dto
 */
export type ProcessoV2Dto = z.infer<typeof ProcessoV2DtoSchema>;

/**
 * Resposta com resumo de processos.
 *
 * @typedef {Object} ProcessoV2Resumo
 */
export type ProcessoV2Resumo = z.infer<typeof ProcessoV2ResumoSchema>;

/**
 * Resposta com movimentações do processo.
 *
 * @typedef {Object} MovimentacoesV2Response
 */
export type MovimentacoesV2Response = z.infer<typeof MovimentacoesV2ResponseSchema>;

/**
 * Resposta com partes envolvidas no processo.
 *
 * @typedef {Object} EnvolvidosV2Response
 */
export type EnvolvidosV2Response = z.infer<typeof EnvolvidosV2ResponseSchema>;

/**
 * Resposta com documentos do processo.
 *
 * @typedef {Object} DocumentosV2Response
 */
export type DocumentosV2Response = z.infer<typeof DocumentosV2ResponseSchema>;

/**
 * Resposta com autos do processo.
 *
 * @typedef {Object} AutosV2Response
 */
export type AutosV2Response = z.infer<typeof AutosV2ResponseSchema>;
