import { z } from 'zod';

export const EntidadeDtoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  tipo: z.enum(['Pessoa', 'Empresa', 'Advogado', 'Desembargador', 'Juiz', 'Promotor']),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  oab: z.string().optional(),
  quantidade_processos: z.number().int().min(0).optional(),
  url_escavador: z.string().optional(),
});

export const BuscaEntidadeResponseSchema = z.object({
  items: z.array(EntidadeDtoSchema),
  total: z.number().int().min(0).optional(),
  pagina: z.number().int().min(1).optional(),
  paginas: z.number().int().min(0).optional(),
});

export type EntidadeDto = z.infer<typeof EntidadeDtoSchema>;
export type BuscaEntidadeResponse = z.infer<typeof BuscaEntidadeResponseSchema>;
