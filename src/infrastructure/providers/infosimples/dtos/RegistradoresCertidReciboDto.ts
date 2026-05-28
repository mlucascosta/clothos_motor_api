/**
 * @fileoverview DTO — Registradores / Certidão Recibo
 * Endpoint: POST consultas/registradores/certid/recibo
 * @module infrastructure/providers/infosimples/dtos/RegistradoresCertidReciboDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresCertidReciboItemSchema = z.object({
  protocolo: z.string().optional(),
  status: z.string().optional(),
  data_pedido: z.string().optional(),
  cartorio: z.string().optional(),
  tipo_certidao: z.string().optional(),
  matricula: z.string().optional(),
  valor: z.number().optional(),
  forma_pagamento: z.string().optional(),
  recibo_numero: z.string().optional(),
}).passthrough();

export const RegistradoresCertidReciboResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresCertidReciboItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresCertidReciboItem = z.infer<typeof RegistradoresCertidReciboItemSchema>;
