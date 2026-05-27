import { z } from 'zod';

export const CallbackV2DtoSchema = z.object({
  id: z.number().int(),
  tipo: z.string(),
  payload: z.record(z.unknown()).optional(),
  tentativas: z.number().int().optional(),
  criado_em: z.string().optional(),
  recebido_em: z.string().optional(),
});

export const ListarCallbacksV2ResponseSchema = z.object({
  items: z.array(CallbackV2DtoSchema),
  total: z.number().int().min(0).optional(),
});

export type CallbackV2Dto = z.infer<typeof CallbackV2DtoSchema>;
export type ListarCallbacksV2Response = z.infer<typeof ListarCallbacksV2ResponseSchema>;
