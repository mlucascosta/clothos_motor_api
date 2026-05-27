import { z } from 'zod';

export const TribunalDtoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  sigla: z.string().optional(),
  tipo: z.string().optional(),
  estado: z.string().optional(),
  ativo: z.boolean().optional(),
});

export const ListarTribunaisResponseSchema = z.object({
  items: z.array(TribunalDtoSchema),
  total: z.number().int().min(0).optional(),
});

export const OrgaoAdministrativoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  sigla: z.string().optional(),
  tipo: z.string().optional(),
});

export const ListarOrgaosResponseSchema = z.object({
  items: z.array(OrgaoAdministrativoSchema),
  total: z.number().int().min(0).optional(),
});

export type TribunalDto = z.infer<typeof TribunalDtoSchema>;
export type ListarTribunaisResponse = z.infer<typeof ListarTribunaisResponseSchema>;
export type OrgaoAdministrativo = z.infer<typeof OrgaoAdministrativoSchema>;
export type ListarOrgaosResponse = z.infer<typeof ListarOrgaosResponseSchema>;
