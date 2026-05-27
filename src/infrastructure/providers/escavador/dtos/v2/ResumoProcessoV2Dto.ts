/**
 * @fileoverview DTO de resumo de processo gerado por IA (API Escavador v2).
 * Representa resumo automático de processo jurídico com status de processamento.
 * @module infrastructure/providers/escavador/dtos/v2/ResumoProcessoV2Dto
 */

import { z } from 'zod';

/**
 * Schema de DTO de resumo de processo (gerado por IA).
 * Retornado por SolicitarResumoProcesso e ObterStatusResumoProcesso.
 *
 * @type {ZodSchema}
 */
export const ResumoProcessoV2DtoSchema = z.object({
  /** ID único da solicitação de resumo */
  id: z.number().int().optional(),
  /** Status do processamento (pendente, processando, concluído, erro) */
  status: z.enum(['pendente', 'processando', 'concluido', 'erro']),
  /** Resumo texto gerado pela IA (apenas quando status='concluido') */
  resumo: z.string().optional(),
  /** Timestamp ISO 8601 de criação da solicitação */
  criado_em: z.string().optional(),
  /** Timestamp ISO 8601 da última atualização */
  atualizado_em: z.string().optional(),
});

/**
 * DTO de resumo de processo gerado por IA.
 * Contém resumo textual do conteúdo jurídico do processo.
 *
 * **Fluxo de uso:**
 * 1. Chamar `SolicitarResumoProcesso(numero_cnj)` → obtém ID
 * 2. Fazer polling com `ObterStatusResumoProcesso(id)` até status='concluido'
 * 3. Acessar campo `resumo` quando pronto
 *
 * **Exemplo:**
 * ```typescript
 * const dto: ResumoProcessoV2Dto = {
 *   id: 12345,
 *   status: "concluido",
 *   resumo: "Processo de cobrança de débito...",
 *   criado_em: "2026-05-20T10:00:00Z",
 *   atualizado_em: "2026-05-20T10:15:00Z"
 * };
 * ```
 *
 * @typedef {Object} ResumoProcessoV2Dto
 */
export type ResumoProcessoV2Dto = z.infer<typeof ResumoProcessoV2DtoSchema>;
