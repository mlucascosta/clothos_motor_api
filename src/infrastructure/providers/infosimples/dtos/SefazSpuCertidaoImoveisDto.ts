/**
 * @fileoverview DTO — Sefaz SPU / Certidão de Imóveis
 * Endpoint: POST consultas/sefaz/spu/certidao-imoveis
 * @module infrastructure/providers/infosimples/dtos/SefazSpuCertidaoImoveisDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const SefazSpuCertidaoImoveisItemSchema = z
  .object({
    tipo_certidao: z.string().optional(),
    numero_certidao: z.string().optional(),
    data_emissao: z.string().optional(),
    validade: z.string().optional(),
    requerente: z.string().optional(),
    cpf_cnpj: z.string().optional(),
    situacao: z.string().optional(),
    url_certidao: z.string().optional(),
    imoveis: z
      .array(
        z
          .object({
            rip: z.string().optional(),
            endereco: z.string().optional(),
            municipio: z.string().optional(),
            uf: z.string().optional(),
            situacao: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

export const SefazSpuCertidaoImoveisResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(SefazSpuCertidaoImoveisItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type SefazSpuCertidaoImoveisItem = z.infer<typeof SefazSpuCertidaoImoveisItemSchema>;
