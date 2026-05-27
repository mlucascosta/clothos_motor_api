import { z } from 'zod';

export const BuscaAssincronaStatusSchema = z.enum([
  'pendente',
  'em_andamento',
  'concluido',
  'erro',
]);

export const BuscaAssincronaDtoSchema = z.object({
  id: z.number().int().positive(),
  status: BuscaAssincronaStatusSchema,
  tipo: z.string(),
  criado_em: z.string().optional(),
  atualizado_em: z.string().optional(),
  resultado: z.unknown().optional(),
});

export const IniciarBuscaResponseSchema = z.object({
  id: z.number().int().positive(),
  status: BuscaAssincronaStatusSchema,
  tipo: z.string().optional(),
});

export const ListarBuscasAssincronasResponseSchema = z.object({
  items: z.array(BuscaAssincronaDtoSchema),
  total: z.number().int().min(0).optional(),
});

export type BuscaAssincronaStatus = z.infer<typeof BuscaAssincronaStatusSchema>;
export type BuscaAssincronaDto = z.infer<typeof BuscaAssincronaDtoSchema>;
export type IniciarBuscaResponse = z.infer<typeof IniciarBuscaResponseSchema>;
export type ListarBuscasAssincronasResponse = z.infer<typeof ListarBuscasAssincronasResponseSchema>;
