/**
 * @fileoverview DTOs de monitoramento contínuo de processos e publicações.
 * Define schemas Zod para alertas de novidades em tempo real.
 * @module infrastructure/providers/escavador/dtos/MonitoramentoDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de monitoramento.
 * Representa um alerta ativo em pessoa, instituição ou processo.
 * @type {ZodSchema}
 */
export const MonitoramentoDtoSchema = z.object({
  /** ID único do monitoramento no Escavador */
  id: z.number().int().positive(),
  /** Nome descritivo do monitoramento (opcional) */
  nome: z.string().optional(),
  /** Se monitoramento está ativo */
  ativo: z.boolean(),
  /** Tipo de monitoramento (ex: 'pessoa', 'instituicao', 'processo') (opcional) */
  tipo: z.string().optional(),
  /** ISO 8601 timestamp de criação (opcional) */
  criado_em: z.string().optional(),
  /** ISO 8601 timestamp de última atualização (opcional) */
  atualizado_em: z.string().optional(),
  /** URL webhook para notificações (opcional) */
  callback_url: z.string().optional(),
});

/**
 * Schema de DTO de aparição em diário oficial.
 * Representa publicação encontrada pelo monitoramento.
 * @type {ZodSchema}
 */
export const AparicaoDtoSchema = z.object({
  /** ID único da aparição no Escavador */
  id: z.number().int().positive(),
  /** Data de publicação no diário (ISO 8601 ou local) */
  data: z.string(),
  /** Nome do diário onde foi publicado (opcional) */
  diario: z.string().optional(),
  /** Conteúdo da publicação (trecho ou texto completo) (opcional) */
  conteudo: z.string().optional(),
  /** URL para visualizar publicação original (opcional) */
  url: z.string().optional(),
});

/**
 * Schema de input para criar monitoramento.
 * @type {ZodSchema}
 */
export const CriarMonitoramentoInputSchema = z.object({
  /** Nome descritivo do monitoramento (opcional) */
  nome: z.string().optional(),
  /** URL webhook para notificações de atualizações (opcional) */
  callback_url: z.string().optional(),
  /** Tipo: 'pessoa', 'instituicao', 'processo', etc. */
  tipo: z.string(),
  /** CPF, CNPJ, número de processo, etc. */
  identificador: z.string(),
  /** Array de tribunais a monitorar (opcional, afeta monitoramento de processos) */
  tribunais: z.array(z.string()).optional(),
});

/**
 * Schema de resposta de listagem de monitoramentos.
 * @type {ZodSchema}
 */
export const ListarMonitoramentosResponseSchema = z.object({
  /** Array de monitoramentos ativos/inativos */
  items: z.array(MonitoramentoDtoSchema),
  /** Total de monitoramentos (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de resposta de listagem de aparições.
 * Publicações encontradas por monitoramento.
 * @type {ZodSchema}
 */
export const ListarAparicaoResponseSchema = z.object({
  /** Array de aparições encontradas */
  items: z.array(AparicaoDtoSchema),
  /** Total de aparições (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de DTO de monitoramento por tribunal.
 * Alerta específico de processo em um tribunal.
 * @type {ZodSchema}
 */
export const MonitoramentoTribunalDtoSchema = z.object({
  /** ID único do monitoramento no tribunal */
  id: z.number().int().positive(),
  /** Se monitoramento está ativo */
  ativo: z.boolean(),
  /** Tipo de monitoramento (ex: 'processo_tribunal') (opcional) */
  tipo: z.string().optional(),
  /** ISO 8601 timestamp de criação (opcional) */
  criado_em: z.string().optional(),
  /** URL webhook para notificações (opcional) */
  callback_url: z.string().optional(),
  /** Tribunal específico monitorado (ex: 'TJSP') (opcional) */
  tribunal: z.string().optional(),
});

/**
 * Schema de resposta de listagem de monitoramentos por tribunal.
 * @type {ZodSchema}
 */
export const ListarMonitoramentosTribunalResponseSchema = z.object({
  /** Array de monitoramentos por tribunal */
  items: z.array(MonitoramentoTribunalDtoSchema),
  /** Total de monitoramentos (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * DTO de monitoramento ativo.
 * @typedef {Object} MonitoramentoDto
 */
export type MonitoramentoDto = z.infer<typeof MonitoramentoDtoSchema>;

/**
 * DTO de aparição em diário oficial (publicação monitorada).
 * @typedef {Object} AparicaoDto
 */
export type AparicaoDto = z.infer<typeof AparicaoDtoSchema>;

/**
 * Input para criar novo monitoramento.
 * @typedef {Object} CriarMonitoramentoInput
 */
export type CriarMonitoramentoInput = z.infer<typeof CriarMonitoramentoInputSchema>;

/**
 * Resposta de listagem de monitoramentos.
 * @typedef {Object} ListarMonitoramentosResponse
 */
export type ListarMonitoramentosResponse = z.infer<typeof ListarMonitoramentosResponseSchema>;

/**
 * Resposta de listagem de aparições/publicações monitoradas.
 * @typedef {Object} ListarAparicaoResponse
 */
export type ListarAparicaoResponse = z.infer<typeof ListarAparicaoResponseSchema>;

/**
 * DTO de monitoramento por tribunal específico.
 * @typedef {Object} MonitoramentoTribunalDto
 */
export type MonitoramentoTribunalDto = z.infer<typeof MonitoramentoTribunalDtoSchema>;

/**
 * Resposta de listagem de monitoramentos por tribunal.
 * @typedef {Object} ListarMonitoramentosTribunalResponse
 */
export type ListarMonitoramentosTribunalResponse = z.infer<
  typeof ListarMonitoramentosTribunalResponseSchema
>;
