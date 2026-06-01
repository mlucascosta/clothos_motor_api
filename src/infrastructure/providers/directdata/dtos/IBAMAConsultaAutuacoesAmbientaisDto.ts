/**
 * @fileoverview DTO de IBAMAConsultaAutuacoesAmbientais — DirectData.
 * @module infrastructure/providers/directdata/dtos/IBAMAConsultaAutuacoesAmbientaisDto
 */

import { z } from 'zod';

export const IBAMAConsultaAutuacoesAmbientaisRetornoSchema = z.object({
  autuacoes: z.array(z.record(z.unknown())).nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  possuiAutuacao: z.boolean().nullable().optional(),
  totalAutuacoes: z.number().int().nullable().optional(),
  valorTotalMultas: z.string().nullable().optional(),
});

export type IBAMAConsultaAutuacoesAmbientaisRetornoDto = z.infer<
  typeof IBAMAConsultaAutuacoesAmbientaisRetornoSchema
>;
