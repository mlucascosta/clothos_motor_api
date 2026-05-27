import { z } from 'zod';

export const MonitoramentoDtoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().optional(),
  ativo: z.boolean(),
  tipo: z.string().optional(),
  criado_em: z.string().optional(),
  atualizado_em: z.string().optional(),
  callback_url: z.string().optional(),
});

export const AparicaoDtoSchema = z.object({
  id: z.number().int().positive(),
  data: z.string(),
  diario: z.string().optional(),
  conteudo: z.string().optional(),
  url: z.string().optional(),
});

export const CriarMonitoramentoInputSchema = z.object({
  nome: z.string().optional(),
  callback_url: z.string().optional(),
  tipo: z.string(),
  identificador: z.string(),
  tribunais: z.array(z.string()).optional(),
});

export const ListarMonitoramentosResponseSchema = z.object({
  items: z.array(MonitoramentoDtoSchema),
  total: z.number().int().min(0).optional(),
});

export const ListarAparicaoResponseSchema = z.object({
  items: z.array(AparicaoDtoSchema),
  total: z.number().int().min(0).optional(),
});

export const MonitoramentoTribunalDtoSchema = z.object({
  id: z.number().int().positive(),
  ativo: z.boolean(),
  tipo: z.string().optional(),
  criado_em: z.string().optional(),
  callback_url: z.string().optional(),
  tribunal: z.string().optional(),
});

export const ListarMonitoramentosTribunalResponseSchema = z.object({
  items: z.array(MonitoramentoTribunalDtoSchema),
  total: z.number().int().min(0).optional(),
});

export type MonitoramentoDto = z.infer<typeof MonitoramentoDtoSchema>;
export type AparicaoDto = z.infer<typeof AparicaoDtoSchema>;
export type CriarMonitoramentoInput = z.infer<typeof CriarMonitoramentoInputSchema>;
export type ListarMonitoramentosResponse = z.infer<typeof ListarMonitoramentosResponseSchema>;
export type ListarAparicaoResponse = z.infer<typeof ListarAparicaoResponseSchema>;
export type MonitoramentoTribunalDto = z.infer<typeof MonitoramentoTribunalDtoSchema>;
export type ListarMonitoramentosTribunalResponse = z.infer<typeof ListarMonitoramentosTribunalResponseSchema>;
