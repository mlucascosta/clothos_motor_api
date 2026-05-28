/**
 * @fileoverview DTO de ANTTConsultaRegularidadeTransportadora — DirectData.
 * @module infrastructure/providers/directdata/dtos/ANTTConsultaRegularidadeTransportadoraDto
 */

import { z } from 'zod';

export const ANTTConsultaRegularidadeTransportadoraRetornoSchema = z.object({
  apto: z.boolean().nullable().optional(),
  categoria: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  localizacao: z.record(z.unknown()),
  observacao: z.string().nullable().optional(),
  protocolo: z.string().nullable().optional(),
  rntrc: z.number().int().nullable().optional(),
  situacao: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  transportador: z.string().nullable().optional()
});

export type ANTTConsultaRegularidadeTransportadoraRetornoDto = z.infer<typeof ANTTConsultaRegularidadeTransportadoraRetornoSchema>;
