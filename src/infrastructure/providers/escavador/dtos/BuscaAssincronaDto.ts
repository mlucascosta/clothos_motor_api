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
export const BuscaAssincronaDtoSchema = z.object({
  /** ID único da busca assíncrona */
  id: z.number().int().positive(),
  /** Status atual (pendente, em_andamento, concluído, erro) */
  status: BuscaAssincronaStatusSchema,
  /** Tipo de busca (ex: 'processos_cpf_cnpj') */
  tipo: z.string(),
  /** ISO 8601 timestamp de criação (opcional) */
  criado_em: z.string().optional(),
  /** ISO 8601 timestamp de última atualização (opcional) */
  atualizado_em: z.string().optional(),
  /** Resultado da busca se status='concluido', senão undefined */
  resultado: z.unknown().optional(),
});

/**
 * Schema de resposta de iniciação de busca assíncrona.
 * Retornado por IniciarBuscaProcessosCpfCnpj.
 * @type {ZodSchema}
 */
export const IniciarBuscaResponseSchema = z.object({
  /** ID único da busca assíncrona criada */
  id: z.number().int().positive(),
  /** Status inicial (geralmente 'pendente' ou 'em_andamento') */
  status: BuscaAssincronaStatusSchema,
  /** Tipo de busca (opcional) */
  tipo: z.string().optional(),
});

/**
 * Schema de resposta de listagem de buscas assíncronas.
 * @type {ZodSchema}
 */
export const ListarBuscasAssincronasResponseSchema = z.object({
  /** Array de buscas assíncronas */
  items: z.array(BuscaAssincronaDtoSchema),
  /** Total de resultados (opcional) */
  total: z.number().int().min(0).optional(),
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
 * Resposta de iniciação de busca assíncrona.
 * @typedef {Object} IniciarBuscaResponse
 */
export type IniciarBuscaResponse = z.infer<typeof IniciarBuscaResponseSchema>;

/**
 * Resposta de listagem de buscas assíncronas.
 * @typedef {Object} ListarBuscasAssincronasResponse
 */
export type ListarBuscasAssincronasResponse = z.infer<typeof ListarBuscasAssincronasResponseSchema>;
