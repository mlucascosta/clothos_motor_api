import { z } from 'zod';

export const PublicacaoDtoSchema = z.object({
  id: z.number().int().optional(),
  data_publicacao: z.string(),
  diario: z.string(),
  secao: z.string().optional(),
  conteudo: z.string(),
  url: z.string().optional(),
});

export const PublicacoesResponseSchema = z.object({
  items: z.array(PublicacaoDtoSchema),
  total: z.number().int().min(0),
  pagina: z.number().int().min(1).optional(),
  paginas: z.number().int().min(0).optional(),
});

export type PublicacaoDto = z.infer<typeof PublicacaoDtoSchema>;
export type PublicacoesResponse = z.infer<typeof PublicacoesResponseSchema>;
