import { z } from 'zod';

export const BuscaResultItemSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  tipo: z.enum(['pessoa', 'processo', 'instituicao', 'advogado']),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  oab: z.string().optional(),
  quantidade_processos: z.number().int().min(0).optional(),
  url_escavador: z.string().optional(),
});

export const BuscaGeralResponseSchema = z.object({
  items: z.array(BuscaResultItemSchema),
  total: z.number().int().min(0).optional(),
  pagina: z.number().int().min(1).optional(),
  paginas: z.number().int().min(0).optional(),
});

export type BuscaResultItem = z.infer<typeof BuscaResultItemSchema>;
export type BuscaGeralResponse = z.infer<typeof BuscaGeralResponseSchema>;
