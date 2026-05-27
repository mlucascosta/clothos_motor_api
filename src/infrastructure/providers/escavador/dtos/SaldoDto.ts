import { z } from 'zod';

export const SaldoDtoSchema = z.object({
  saldo: z.number().int().min(0),
  saldo_utilizado: z.number().int().min(0).optional(),
  limite: z.number().int().min(0).optional(),
  renovacao_em: z.string().optional(),
});

export type SaldoDto = z.infer<typeof SaldoDtoSchema>;
