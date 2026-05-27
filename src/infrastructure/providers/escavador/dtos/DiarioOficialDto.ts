import { z } from 'zod';

export const DiarioOficialOrigemSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  sigla: z.string().optional(),
  estado: z.string().optional(),
  tipo: z.string().optional(),
  ativo: z.boolean().optional(),
});

export const ListarOrigensDiariosResponseSchema = z.object({
  items: z.array(DiarioOficialOrigemSchema),
  total: z.number().int().min(0).optional(),
});

export type DiarioOficialOrigem = z.infer<typeof DiarioOficialOrigemSchema>;
export type ListarOrigensDiariosResponse = z.infer<typeof ListarOrigensDiariosResponseSchema>;
