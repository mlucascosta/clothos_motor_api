/**
 * @fileoverview DTO — Registradores / Matrícula Recibo
 * Endpoint: POST consultas/registradores/matric/recibo
 * @module infrastructure/providers/infosimples/dtos/RegistradoresMatricReciboDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresMatricReciboItemSchema = z.object({
  protocolo: z.string().optional(),
  status: z.string().optional(),
  matricula: z.string().optional(),
  cartorio: z.string().optional(),
  data_pedido: z.string().optional(),
  valor: z.number().optional(),
  forma_pagamento: z.string().optional(),
  recibo_numero: z.string().optional(),
}).passthrough();

export const RegistradoresMatricReciboResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresMatricReciboItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresMatricReciboItem = z.infer<typeof RegistradoresMatricReciboItemSchema>;
