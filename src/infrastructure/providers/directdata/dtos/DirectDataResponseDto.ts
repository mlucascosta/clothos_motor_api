/**
 * @fileoverview DTO genérico de resposta da API DirectData.
 * Todas as consultas retornam a mesma estrutura base: metaDados + retorno.
 * @module infrastructure/providers/directdata/dtos/DirectDataResponseDto
 */

import { z } from 'zod';

/**
 * Schema de metadados presente em toda resposta da DirectData.
 *
 * @type {ZodSchema}
 */
export const DirectDataMetaDadosSchema = z.object({
  apiVersao: z.string().optional(),
  assincrono: z.boolean().optional(),
  chave: z.string().optional(),
  consultaNome: z.string().optional(),
  consultaUid: z.string().optional(),
  data: z.string().optional(),
  enviarCallback: z.boolean().optional(),
  gerarComprovante: z.boolean().optional(),
  ip: z.string().optional(),
  mensagem: z.string().optional(),
  resultado: z.string().optional(),
  resultadoId: z.number().optional(),
  tempoExecucaoMs: z.number().optional(),
  urlComprovante: z.string().nullable().optional(),
  usuario: z.unknown().nullable().optional(),
});

/**
 * Schema de resposta genérica da DirectData.
 * O campo `retorno` varia por endpoint (any).
 *
 * @type {ZodSchema}
 */
export const DirectDataResponseSchema = z
  .object({
    metaDados: DirectDataMetaDadosSchema,
    retorno: z.unknown().nullable(),
  })
  .required();

/**
 * Tipo de metadados da DirectData.
 *
 * @typedef {Object} DirectDataMetaDados
 */
export type DirectDataMetaDados = z.infer<typeof DirectDataMetaDadosSchema>;

/**
 * Tipo de resposta genérica da DirectData.
 *
 * @typedef {Object} DirectDataResponseDto
 * @property {DirectDataMetaDados} metaDados - Metadados da consulta
 * @property {unknown} retorno - Dados específicos da consulta (varia por endpoint)
 */
export type DirectDataResponseDto = z.infer<typeof DirectDataResponseSchema>;
