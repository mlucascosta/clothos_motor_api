import { z } from 'zod';

export const ProcessoEnvolvidosResponseSchema = z.object({
  items: z.array(z.unknown()),
  total: z.number(),
});

export type ProcessoEnvolvidosResponse = z.infer<typeof ProcessoEnvolvidosResponseSchema>;
