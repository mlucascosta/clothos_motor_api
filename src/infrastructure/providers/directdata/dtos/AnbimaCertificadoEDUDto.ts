/**
 * @fileoverview DTO de AnbimaCertificadoEDU — DirectData.
 * @module infrastructure/providers/directdata/dtos/AnbimaCertificadoEDUDto
 */

import { z } from 'zod';

export const AnbimaCertificadoEDURetornoSchema = z.object({
  certificacoes: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  possuiCertificacoes: z.boolean().optional()
});

export type AnbimaCertificadoEDURetornoDto = z.infer<typeof AnbimaCertificadoEDURetornoSchema>;
