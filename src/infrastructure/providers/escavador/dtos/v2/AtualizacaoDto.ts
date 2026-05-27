import { z } from 'zod';

export const AtualizacaoStatusSchema = z.enum(['pendente', 'em_andamento', 'concluido', 'erro']);

export const AtualizacaoLoteDtoSchema = z.object({
  id: z.number().int(),
  status: AtualizacaoStatusSchema,
  total: z.number().int().optional(),
  processados: z.number().int().optional(),
  criado_em: z.string().optional(),
});

export const AtualizacaoProcessoDtoSchema = z.object({
  id: z.number().int(),
  status: AtualizacaoStatusSchema,
  processo_id: z.number().int().optional(),
  criado_em: z.string().optional(),
});

export type AtualizacaoStatus = z.infer<typeof AtualizacaoStatusSchema>;
export type AtualizacaoLoteDto = z.infer<typeof AtualizacaoLoteDtoSchema>;
export type AtualizacaoProcessoDto = z.infer<typeof AtualizacaoProcessoDtoSchema>;
