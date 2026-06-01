/**
 * @fileoverview DTOs de callbacks de webhooks do Escavador.
 * Define schemas Zod para notificações assíncronas de atualizações.
 * @module infrastructure/providers/escavador/dtos/CallbackDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de callback recebido do Escavador.
 * Representa notificação assíncrona de atualização (monitoramento, busca concluída, etc.).
 * @type {ZodSchema}
 */
export const CallbackDtoSchema = z.object({
  /** ID único do callback no Escavador */
  id: z.number().int().positive(),
  /** Tipo de evento ('monitoring_update', 'async_search_complete', etc.) */
  tipo: z.string(),
  /** Status de processamento do callback (ex: 'pendente', 'processado') (opcional) */
  status: z.string().optional(),
  /** ISO 8601 timestamp de criação do callback (opcional) */
  criado_em: z.string().optional(),
  /** ISO 8601 timestamp de recebimento confirmado (opcional) */
  recebido_em: z.string().optional(),
  /** Conteúdo bruto do callback (JSON desserializado) (opcional) */
  payload: z.unknown().optional(),
});

/**
 * Schema de resposta de listagem de callbacks.
 * @type {ZodSchema}
 */
export const ListarCallbacksResponseSchema = z.object({
  /** Array de callbacks pendentes/recebidos */
  items: z.array(CallbackDtoSchema),
  paginator: z
    .object({
      total: z.number().int().nullish(),
      total_pages: z.number().int().nullish(),
      current_page: z.number().int().nullish(),
      per_page: z.number().int().nullish(),
    })
    .nullish(),
  links: z.object({ next: z.string().nullish(), prev: z.string().nullish() }).nullish(),
  total: z.number().int().nullish(),
});

/**
 * Schema de input para marcar callbacks como recebidos.
 * Confirm receipt para evitar retransmissão.
 * @type {ZodSchema}
 */
export const MarcarCallbacksRecebidosInputSchema = z.object({
  /** Array de IDs de callbacks a marcar como recebidos */
  ids: z.array(z.number().int().positive()),
});

/**
 * Schema de input para reenvio manual de callback.
 * Força retentativa de entrega de callback específico.
 * @type {ZodSchema}
 */
export const ReenviarCallbackInputSchema = z.object({
  /** ID do callback a reenviar */
  id: z.number().int().positive(),
});

/**
 * DTO de callback de webhook do Escavador.
 * @typedef {Object} CallbackDto
 */
export type CallbackDto = z.infer<typeof CallbackDtoSchema>;

/**
 * Resposta de listagem de callbacks.
 * @typedef {Object} ListarCallbacksResponse
 */
export type ListarCallbacksResponse = z.infer<typeof ListarCallbacksResponseSchema>;

/**
 * Input para marcar callbacks como recebidos.
 * @typedef {Object} MarcarCallbacksRecebidosInput
 */
export type MarcarCallbacksRecebidosInput = z.infer<typeof MarcarCallbacksRecebidosInputSchema>;

/**
 * Input para reenvio manual de callback.
 * @typedef {Object} ReenviarCallbackInput
 */
export type ReenviarCallbackInput = z.infer<typeof ReenviarCallbackInputSchema>;
