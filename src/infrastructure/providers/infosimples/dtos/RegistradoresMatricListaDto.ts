/**
 * @fileoverview DTO — Registradores / Matrícula Lista
 * Endpoint: POST consultas/registradores/matric/lista
 * @module infrastructure/providers/infosimples/dtos/RegistradoresMatricListaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresMatricListaItemSchema = z.object({
  protocolo: z.string().optional(),
  status: z.string().optional(),
  matricula: z.string().optional(),
  cartorio: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  finalidade: z.string().optional(),
  data_pedido: z.string().optional(),
  previsao_entrega: z.string().optional(),
}).passthrough();

export const RegistradoresMatricListaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresMatricListaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresMatricListaItem = z.infer<typeof RegistradoresMatricListaItemSchema>;
