import { z } from 'zod';

export const EnvolvidoV2DtoSchema = z.object({
  id: z.number().int().optional(),
  nome: z.string(),
  tipo: z.string().optional(),
  cpf_cnpj: z.string().optional(),
  oab: z.string().optional(),
});

export const MovimentacaoV2DtoSchema = z.object({
  id: z.number().int().optional(),
  data: z.string(),
  descricao: z.string(),
  tipo: z.string().optional(),
});

export const DocumentoV2DtoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  tipo: z.string().optional(),
  url: z.string().optional(),
});

export const AutoV2DtoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  tipo: z.string().optional(),
});

export const ProcessoV2DtoSchema = z.object({
  id: z.number().int().optional(),
  numero_cnj: z.string(),
  tribunal: z.string().optional(),
  data_ajuizamento: z.string().optional(),
  partes: z.array(EnvolvidoV2DtoSchema).optional(),
  movimentacoes: z.array(MovimentacaoV2DtoSchema).optional(),
});

export const ProcessoV2ResumoSchema = z.object({
  total: z.number().int().min(0).optional(),
  items: z.array(ProcessoV2DtoSchema),
});

export const MovimentacoesV2ResponseSchema = z.object({
  items: z.array(MovimentacaoV2DtoSchema),
  total: z.number().int().min(0).optional(),
});

export const EnvolvidosV2ResponseSchema = z.object({
  items: z.array(EnvolvidoV2DtoSchema),
  total: z.number().int().min(0).optional(),
});

export const DocumentosV2ResponseSchema = z.object({
  items: z.array(DocumentoV2DtoSchema),
  total: z.number().int().min(0).optional(),
});

export const AutosV2ResponseSchema = z.object({
  items: z.array(AutoV2DtoSchema),
  total: z.number().int().min(0).optional(),
});

export type EnvolvidoV2Dto = z.infer<typeof EnvolvidoV2DtoSchema>;
export type MovimentacaoV2Dto = z.infer<typeof MovimentacaoV2DtoSchema>;
export type DocumentoV2Dto = z.infer<typeof DocumentoV2DtoSchema>;
export type AutoV2Dto = z.infer<typeof AutoV2DtoSchema>;
export type ProcessoV2Dto = z.infer<typeof ProcessoV2DtoSchema>;
export type ProcessoV2Resumo = z.infer<typeof ProcessoV2ResumoSchema>;
export type MovimentacoesV2Response = z.infer<typeof MovimentacoesV2ResponseSchema>;
export type EnvolvidosV2Response = z.infer<typeof EnvolvidosV2ResponseSchema>;
export type DocumentosV2Response = z.infer<typeof DocumentosV2ResponseSchema>;
export type AutosV2Response = z.infer<typeof AutosV2ResponseSchema>;
