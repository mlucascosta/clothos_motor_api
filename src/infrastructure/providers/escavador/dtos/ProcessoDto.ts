import { z } from 'zod';

export const ParteDtoSchema = z.object({
  id: z.number().int().optional(),
  nome: z.string(),
  tipo_parte: z.string(),
  advogados: z
    .array(z.object({ nome: z.string(), oab: z.string().optional() }))
    .optional()
    .default([]),
});

export const ProcessoDtoSchema = z.object({
  id: z.number().int().optional(),
  numero_cnj: z.string(),
  tribunal: z.string(),
  data_ajuizamento: z.string().optional(),
  tipo_acao: z.string().optional(),
  valor_causa: z.number().optional(),
  ativo: z.boolean().optional(),
  ultima_movimentacao: z.string().optional(),
  partes: z.array(ParteDtoSchema).optional().default([]),
});

export const ProcessosEntidadeResponseSchema = z.object({
  items: z.array(ProcessoDtoSchema),
  total: z.number().int().min(0),
  pagina: z.number().int().min(1).optional(),
  paginas: z.number().int().min(0).optional(),
});

export type ParteDto = z.infer<typeof ParteDtoSchema>;
export type ProcessoDto = z.infer<typeof ProcessoDtoSchema>;
export type ProcessosEntidadeResponse = z.infer<typeof ProcessosEntidadeResponseSchema>;
