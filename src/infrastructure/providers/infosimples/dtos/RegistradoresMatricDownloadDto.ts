/**
 * @fileoverview DTO — Registradores / Matrícula Download
 * Endpoint: POST consultas/registradores/matric/download
 * @module infrastructure/providers/infosimples/dtos/RegistradoresMatricDownloadDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresMatricDownloadItemSchema = z
  .object({
    protocolo: z.string().optional(),
    status: z.string().optional(),
    url_download: z.string().optional(),
    nome_arquivo: z.string().optional(),
    matricula: z.string().optional(),
    cartorio: z.string().optional(),
    data_disponibilizacao: z.string().optional(),
    validade: z.string().optional(),
  })
  .passthrough();

export const RegistradoresMatricDownloadResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresMatricDownloadItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresMatricDownloadItem = z.infer<typeof RegistradoresMatricDownloadItemSchema>;
