/**
 * @fileoverview DTO de IBAMACertificadoRegularidade — DirectData.
 * @module infrastructure/providers/directdata/dtos/IBAMACertificadoRegularidadeDto
 */

import { z } from 'zod';

export const IBAMACertificadoRegularidadeRetornoSchema = z.object({
  atividades: z.record(z.unknown()),
  bairro: z.string().nullable().optional(),
  categorias: z.record(z.unknown()),
  cep: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
  constaCertificado: z.boolean().nullable().optional(),
  dataAbertura: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  logradouro: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  nomeEmpresarial: z.string().nullable().optional(),
  nomeFantasia: z.string().nullable().optional(),
  numero: z.number().int().nullable().optional(),
  numeroRegistro: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
  uf: z.string().nullable().optional()
});

export type IBAMACertificadoRegularidadeRetornoDto = z.infer<typeof IBAMACertificadoRegularidadeRetornoSchema>;
