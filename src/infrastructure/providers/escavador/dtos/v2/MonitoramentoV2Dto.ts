import { z } from 'zod';
import { ProcessoV2DtoSchema } from './ProcessoV2Dto.js';

export const MonitoramentoNovosProcessosDtoSchema = z.object({
  id: z.number().int(),
  ativo: z.boolean().optional(),
  variacao_busca: z.string().optional(),
  tribunais: z.array(z.number().int()).optional(),
  callback_url: z.string().optional(),
  criado_em: z.string().optional(),
  atualizado_em: z.string().optional(),
});

export const ListarMonitoramentosNovosProcessosResponseSchema = z.object({
  items: z.array(MonitoramentoNovosProcessosDtoSchema),
  total: z.number().int().min(0).optional(),
});

export const ResultadosMonitoramentoNovosProcessosResponseSchema = z.object({
  items: z.array(ProcessoV2DtoSchema),
  total: z.number().int().min(0).optional(),
});

export const MonitoramentoProcessoDtoSchema = z.object({
  id: z.number().int(),
  ativo: z.boolean().optional(),
  processo_id: z.number().int().optional(),
  callback_url: z.string().optional(),
  criado_em: z.string().optional(),
});

export const ListarMonitoramentosProcessoResponseSchema = z.object({
  items: z.array(MonitoramentoProcessoDtoSchema),
  total: z.number().int().min(0).optional(),
});

export type MonitoramentoNovosProcessosDto = z.infer<typeof MonitoramentoNovosProcessosDtoSchema>;
export type ListarMonitoramentosNovosProcessosResponse = z.infer<typeof ListarMonitoramentosNovosProcessosResponseSchema>;
export type ResultadosMonitoramentoNovosProcessosResponse = z.infer<typeof ResultadosMonitoramentoNovosProcessosResponseSchema>;
export type MonitoramentoProcessoDto = z.infer<typeof MonitoramentoProcessoDtoSchema>;
export type ListarMonitoramentosProcessoResponse = z.infer<typeof ListarMonitoramentosProcessoResponseSchema>;
