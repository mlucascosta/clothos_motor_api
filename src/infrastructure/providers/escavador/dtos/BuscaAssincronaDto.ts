/**
 * @fileoverview DTOs de operações assíncronas no Escavador.
 * Define schemas Zod e tipos TypeScript para buscas assíncronas (polling).
 * Usado em IniciarBuscaProcessosCpfCnpj e ObterBuscaAssincrona.
 * @module infrastructure/providers/escavador/dtos/BuscaAssincronaDto
 */

import { z } from 'zod';

/**
 * Status possível de uma busca assíncrona.
 * @type {ZodSchema}
 */
export const BuscaAssincronaStatusSchema = z.enum([
  'pendente',
  'em_andamento',
  'concluido',
  'erro',
]);

/**
 * Schema de DTO completo de busca assíncrona com resultado.
 * Retornado por ObterBuscaAssincrona após polling.
 * @type {ZodSchema}
 */
export const BuscaAssincronaDtoSchema = z
  .object({
    id: z.number().int().positive(),
    status: z.string(),
    tipo: z.string().optional(),
    criado_em: z.string().optional(),
    atualizado_em: z.string().optional(),
    resultado: z.unknown().optional(),
    resposta: z.unknown().optional(),
    motivo_erro: z.string().nullish(),
    tribunal: z.record(z.unknown()).optional(),
    valor: z.string().optional(),
    link_api: z.string().optional(),
  })
  .passthrough();

/**
 * Schema de resposta de iniciação de busca assíncrona.
 * Retornado por IniciarBuscaProcesso e IniciarBuscaProcessoNup.
 * Status retornado pela API em UPPERCASE (PENDENTE, SUCESSO, ERRO, NAO_ENCONTRADO).
 * @type {ZodSchema}
 */
export const IniciarBuscaResponseSchema = z
  .object({
    id: z.number().int().positive(),
    status: z.string(),
    tipo: z.string().optional(),
  })
  .passthrough();

/**
 * Schema de item individual retornado pela busca em lote (por tribunal).
 * @type {ZodSchema}
 */
export const BuscaAssincronaItemResponseSchema = z
  .object({
    id: z.number().int().positive(),
    status: z.string(),
    tipo: z.string().optional(),
    tribunal: z.record(z.unknown()).optional(),
    valor: z.string().optional(),
    link_api: z.string().optional(),
  })
  .passthrough();

/**
 * Schema de resposta do endpoint POST /api/v1/tribunal/async/lote.
 * Retorna array de buscas iniciadas, uma por tribunal.
 * @type {ZodSchema}
 */
export const IniciarBuscaLoteResponseSchema = z.object({
  items: z.array(BuscaAssincronaItemResponseSchema),
});

/**
 * Schema de resposta de listagem de buscas assíncronas.
 * @type {ZodSchema}
 */
export const ListarBuscasAssincronasResponseSchema = z.object({
  /** Array de buscas assíncronas */
  items: z.array(BuscaAssincronaDtoSchema),
  paginator: z.object({
    total: z.number().int().nullish(),
    total_pages: z.number().int().nullish(),
    current_page: z.number().int().nullish(),
    per_page: z.number().int().nullish(),
  }).nullish(),
  links: z.object({ next: z.string().nullish(), prev: z.string().nullish() }).nullish(),
  total: z.number().int().nullish(),
});

/**
 * Status de uma busca assíncrona.
 * @typedef {'pendente' | 'em_andamento' | 'concluido' | 'erro'} BuscaAssincronaStatus
 */
export type BuscaAssincronaStatus = z.infer<typeof BuscaAssincronaStatusSchema>;

/**
 * DTO de busca assíncrona completo com resultado.
 * Representa estado completo de uma busca iniciada.
 * @typedef {Object} BuscaAssincronaDto
 */
export type BuscaAssincronaDto = z.infer<typeof BuscaAssincronaDtoSchema>;

/**
 * Resposta de iniciação de busca assíncrona (single — processo-tribunal, processo-administrativo).
 * @typedef {Object} IniciarBuscaResponse
 */
export type IniciarBuscaResponse = z.infer<typeof IniciarBuscaResponseSchema>;

/**
 * Resposta de iniciação de busca em lote por tribunal (nome, documento, oab).
 * @typedef {Object} IniciarBuscaLoteResponse
 */
export type IniciarBuscaLoteResponse = z.infer<typeof IniciarBuscaLoteResponseSchema>;

/**
 * Resposta de listagem de buscas assíncronas.
 * @typedef {Object} ListarBuscasAssincronasResponse
 */
export type ListarBuscasAssincronasResponse = z.infer<typeof ListarBuscasAssincronasResponseSchema>;
