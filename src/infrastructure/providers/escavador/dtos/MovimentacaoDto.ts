import { z } from 'zod';

export const MovimentacaoDtoSchema = z.object({
  id: z.number().int().optional(),
  data: z.string(),
  tipo: z.string(),
  descricao: z.string(),
  documento_url: z.string().optional(),
});

export const MovimentacoesResponseSchema = z.object({
  items: z.array(MovimentacaoDtoSchema),
  total: z.number().int().min(0),
  pagina: z.number().int().min(1).optional(),
  paginas: z.number().int().min(0).optional(),
});

export type MovimentacaoDto = z.infer<typeof MovimentacaoDtoSchema>;
export type MovimentacoesResponse = z.infer<typeof MovimentacoesResponseSchema>;
