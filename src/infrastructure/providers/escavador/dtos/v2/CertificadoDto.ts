import { z } from 'zod';

export const AutenticacaoDtoSchema = z.object({
  id: z.number().int(),
  tipo: z.string(),
  valor: z.string().optional(),
  criado_em: z.string().optional(),
});

export const CertificadoDtoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  validade: z.string().optional(),
  ativo: z.boolean().optional(),
  criado_em: z.string().optional(),
  autenticacoes: z.array(AutenticacaoDtoSchema).optional(),
});

export const ListarCertificadosResponseSchema = z.object({
  items: z.array(CertificadoDtoSchema),
  total: z.number().int().min(0).optional(),
});

export type AutenticacaoDto = z.infer<typeof AutenticacaoDtoSchema>;
export type CertificadoDto = z.infer<typeof CertificadoDtoSchema>;
export type ListarCertificadosResponse = z.infer<typeof ListarCertificadosResponseSchema>;
