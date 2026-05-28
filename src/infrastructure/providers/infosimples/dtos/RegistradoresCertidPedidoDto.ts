/**
 * @fileoverview DTO — Registradores / Certidão Pedido
 * Endpoint: POST consultas/registradores/certid/pedido
 * @module infrastructure/providers/infosimples/dtos/RegistradoresCertidPedidoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresCertidPedidoItemSchema = z.object({
  protocolo: z.string().optional(),
  status: z.string().optional(),
  uf: z.string().optional(),
  municipio: z.string().optional(),
  cartorio: z.string().optional(),
  tipo_certidao: z.string().optional(),
  matricula: z.string().optional(),
  data_pedido: z.string().optional(),
  previsao_entrega: z.string().optional(),
  valor: z.number().optional(),
}).passthrough();

export const RegistradoresCertidPedidoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresCertidPedidoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresCertidPedidoItem = z.infer<typeof RegistradoresCertidPedidoItemSchema>;
