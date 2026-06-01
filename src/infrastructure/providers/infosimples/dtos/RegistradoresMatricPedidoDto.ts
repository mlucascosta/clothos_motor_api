/**
 * @fileoverview DTO — Registradores / Matrícula Pedido
 * Endpoint: POST consultas/registradores/matric/pedido
 * @module infrastructure/providers/infosimples/dtos/RegistradoresMatricPedidoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresMatricPedidoItemSchema = z
  .object({
    protocolo: z.string().optional(),
    status: z.string().optional(),
    matricula: z.string().optional(),
    cartorio: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    finalidade: z.string().optional(),
    data_pedido: z.string().optional(),
    previsao_entrega: z.string().optional(),
    valor: z.number().optional(),
  })
  .passthrough();

export const RegistradoresMatricPedidoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresMatricPedidoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresMatricPedidoItem = z.infer<typeof RegistradoresMatricPedidoItemSchema>;
