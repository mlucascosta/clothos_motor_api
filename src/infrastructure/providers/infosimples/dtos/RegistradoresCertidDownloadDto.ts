/**
 * @fileoverview DTO — Registradores / Certidão Download
 * Endpoint: POST consultas/registradores/certid/download
 * @module infrastructure/providers/infosimples/dtos/RegistradoresCertidDownloadDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresCertidDownloadItemSchema = z.object({
  protocolo: z.string().optional(),
  status: z.string().optional(),
  url_download: z.string().optional(),
  nome_arquivo: z.string().optional(),
  data_disponibilizacao: z.string().optional(),
  validade: z.string().optional(),
}).passthrough();

export const RegistradoresCertidDownloadResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresCertidDownloadItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresCertidDownloadItem = z.infer<typeof RegistradoresCertidDownloadItemSchema>;
