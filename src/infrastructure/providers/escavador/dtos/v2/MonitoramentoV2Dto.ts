/**
 * @fileoverview DTOs de monitoramento de novos processos e processos específicos (API Escavador v2).
 * Define schemas Zod para alertas de novos processos encontrados e monitoramento contínuo.
 * @module infrastructure/providers/escavador/dtos/v2/MonitoramentoV2Dto
 */

import { z } from 'zod';
import { ProcessoV2DtoSchema } from './ProcessoV2Dto.js';

/**
 * Schema de DTO de monitoramento de novos processos.
 * Alerta ativo para novos processos encontrados em uma busca.
 * @type {ZodSchema}
 */
export const MonitoramentoNovosProcessosDtoSchema = z.object({
  /** ID único do monitoramento */
  id: z.number().int(),
  /** Se monitoramento está ativo (opcional, padrão true) */
  ativo: z.boolean().optional(),
  /** Variação de busca (critério para encontrar novos processos) (opcional) */
  variacao_busca: z.string().optional(),
  /** Array de IDs de tribunais a monitorar (opcional) */
  tribunais: z.array(z.number().int()).optional(),
  /** URL webhook para notificações (opcional) */
  callback_url: z.string().optional(),
  /** ISO 8601 timestamp de criação (opcional) */
  criado_em: z.string().optional(),
  /** ISO 8601 timestamp de última atualização (opcional) */
  atualizado_em: z.string().optional(),
});

/**
 * Schema de resposta de listagem de monitoramentos de novos processos.
 * @type {ZodSchema}
 */
export const ListarMonitoramentosNovosProcessosResponseSchema = z.object({
  /** Array de monitoramentos de novos processos */
  items: z.array(MonitoramentoNovosProcessosDtoSchema),
  /** Total de monitoramentos (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de resposta com resultados (processos encontrados) de monitoramento de novos processos.
 * @type {ZodSchema}
 */
export const ResultadosMonitoramentoNovosProcessosResponseSchema = z.object({
  /** Array de processos encontrados recentemente no monitoramento */
  items: z.array(ProcessoV2DtoSchema),
  /** Total de processos encontrados (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de DTO de monitoramento de processo específico.
 * Alerta ativo para atualizações de um processo particular.
 * @type {ZodSchema}
 */
export const MonitoramentoProcessoDtoSchema = z.object({
  /** ID único do monitoramento */
  id: z.number().int(),
  /** Se monitoramento está ativo (opcional, padrão true) */
  ativo: z.boolean().optional(),
  /** ID do processo sendo monitorado (opcional) */
  processo_id: z.number().int().optional(),
  /** URL webhook para notificações de atualizações (opcional) */
  callback_url: z.string().optional(),
  /** ISO 8601 timestamp de criação (opcional) */
  criado_em: z.string().optional(),
});

/**
 * Schema de resposta de listagem de monitoramentos de processos específicos.
 * @type {ZodSchema}
 */
export const ListarMonitoramentosProcessoResponseSchema = z.object({
  /** Array de monitoramentos de processos */
  items: z.array(MonitoramentoProcessoDtoSchema),
  /** Total de monitoramentos (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * DTO de monitoramento de novos processos (API v2).
 * Alerta para novos processos encontrados por critérios de busca.
 * @typedef {Object} MonitoramentoNovosProcessosDto
 */
export type MonitoramentoNovosProcessosDto = z.infer<typeof MonitoramentoNovosProcessosDtoSchema>;

/**
 * Resposta de listagem de monitoramentos de novos processos.
 * @typedef {Object} ListarMonitoramentosNovosProcessosResponse
 */
export type ListarMonitoramentosNovosProcessosResponse = z.infer<
  typeof ListarMonitoramentosNovosProcessosResponseSchema
>;

/**
 * Resposta com resultados (processos encontrados) de monitoramento de novos processos.
 * @typedef {Object} ResultadosMonitoramentoNovosProcessosResponse
 */
export type ResultadosMonitoramentoNovosProcessosResponse = z.infer<
  typeof ResultadosMonitoramentoNovosProcessosResponseSchema
>;

/**
 * DTO de monitoramento de processo específico.
 * Alerta para atualizações de um processo particular.
 * @typedef {Object} MonitoramentoProcessoDto
 */
export type MonitoramentoProcessoDto = z.infer<typeof MonitoramentoProcessoDtoSchema>;

/**
 * Resposta de listagem de monitoramentos de processos específicos.
 * @typedef {Object} ListarMonitoramentosProcessoResponse
 */
export type ListarMonitoramentosProcessoResponse = z.infer<
  typeof ListarMonitoramentosProcessoResponseSchema
>;
