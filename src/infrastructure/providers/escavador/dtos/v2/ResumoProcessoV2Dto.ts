import { z } from 'zod';

export const ResumoProcessoV2DtoSchema = z.object({
  id: z.number().int().optional(),
  status: z.enum(['pendente', 'processando', 'concluido', 'erro']),
  resumo: z.string().optional(),
  criado_em: z.string().optional(),
  atualizado_em: z.string().optional(),
});

export type ResumoProcessoV2Dto = z.infer<typeof ResumoProcessoV2DtoSchema>;
