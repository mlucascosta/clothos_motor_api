import { z } from 'zod';

export const CallbackDtoSchema = z.object({
  id: z.number().int().positive(),
  tipo: z.string(),
  status: z.string().optional(),
  criado_em: z.string().optional(),
  recebido_em: z.string().optional(),
  payload: z.unknown().optional(),
});

export const ListarCallbacksResponseSchema = z.object({
  items: z.array(CallbackDtoSchema),
  total: z.number().int().min(0).optional(),
});

export const MarcarCallbacksRecebidosInputSchema = z.object({
  ids: z.array(z.number().int().positive()),
});

export const ReenviarCallbackInputSchema = z.object({
  id: z.number().int().positive(),
});

export type CallbackDto = z.infer<typeof CallbackDtoSchema>;
export type ListarCallbacksResponse = z.infer<typeof ListarCallbacksResponseSchema>;
export type MarcarCallbacksRecebidosInput = z.infer<typeof MarcarCallbacksRecebidosInputSchema>;
export type ReenviarCallbackInput = z.infer<typeof ReenviarCallbackInputSchema>;
