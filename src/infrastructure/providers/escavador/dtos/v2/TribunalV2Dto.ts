import { z } from 'zod';

export const SistemaJudicialSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  sigla: z.string().optional(),
});

export const ListarSistemasResponseSchema = z.object({
  items: z.array(SistemaJudicialSchema),
  total: z.number().int().min(0).optional(),
});

export const TribunalV2DtoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  sigla: z.string().optional(),
  sistema_id: z.number().int().optional(),
});

export const ListarTribunaisV2ResponseSchema = z.object({
  items: z.array(TribunalV2DtoSchema),
  total: z.number().int().min(0).optional(),
});

export type SistemaJudicial = z.infer<typeof SistemaJudicialSchema>;
export type ListarSistemasResponse = z.infer<typeof ListarSistemasResponseSchema>;
export type TribunalV2Dto = z.infer<typeof TribunalV2DtoSchema>;
export type ListarTribunaisV2Response = z.infer<typeof ListarTribunaisV2ResponseSchema>;
