/**
 * @fileoverview DTOs de callbacks de webhooks (API Escavador v2).
 * Define schemas Zod para notificações assíncronas.
 * @module infrastructure/providers/escavador/dtos/v2/CallbackV2Dto
 */

import { z } from 'zod';

/**
 * Schema de DTO de callback (API v2).
 * Representa notificação de webhook com tentativas de entrega rastreadas.
 * @type {ZodSchema}
 */
export const CallbackV2DtoSchema = z.object({
  /** ID único do callback no Escavador */
  id: z.number().int(),
  /** Tipo de evento ('processo_atualizado', 'monitoramento_novo_processo', etc.) */
  tipo: z.string(),
  /** Conteúdo do callback como object key-value (opcional) */
  payload: z.record(z.unknown()).optional(),
  /** Número de tentativas de entrega feitas (opcional) */
  tentativas: z.number().int().optional(),
  /** ISO 8601 timestamp de criação (opcional) */
  criado_em: z.string().optional(),
  /** ISO 8601 timestamp de confirmação de recebimento (opcional) */
  recebido_em: z.string().optional(),
});

/**
 * Schema de resposta de listagem de callbacks (API v2).
 * @type {ZodSchema}
 */
export const ListarCallbacksV2ResponseSchema = z.object({
  /** Array de callbacks pendentes/entregues */
  items: z.array(CallbackV2DtoSchema),
  /** Total de callbacks (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * DTO de callback (API v2) com rastreamento de tentativas.
 * @typedef {Object} CallbackV2Dto
 */
export type CallbackV2Dto = z.infer<typeof CallbackV2DtoSchema>;

/**
 * Resposta de listagem de callbacks (API v2).
 * @typedef {Object} ListarCallbacksV2Response
 */
export type ListarCallbacksV2Response = z.infer<typeof ListarCallbacksV2ResponseSchema>;
