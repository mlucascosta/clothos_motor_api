import { z } from 'zod';

export const PessoaDtoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  cpf: z.string().optional(),
  data_nascimento: z.string().optional(),
  sexo: z.enum(['M', 'F', 'O']).optional(),
  quantidade_processos: z.number().int().min(0).optional(),
  url_escavador: z.string().optional(),
});

export const ProcessoResumidoSchema = z.object({
  id: z.number().int().positive(),
  numero_cnj: z.string(),
  tribunal: z.string(),
  data_ajuizamento: z.string().optional(),
  tipo_acao: z.string().optional(),
  ativo: z.boolean().optional(),
  ultima_movimentacao: z.string().optional(),
});

export const PessoaProcessosResponseSchema = z.object({
  items: z.array(ProcessoResumidoSchema),
  total: z.number().int().min(0),
  pagina: z.number().int().min(1).optional(),
  paginas: z.number().int().min(0).optional(),
});

export type PessoaDto = z.infer<typeof PessoaDtoSchema>;
export type ProcessoResumido = z.infer<typeof ProcessoResumidoSchema>;
export type PessoaProcessosResponse = z.infer<typeof PessoaProcessosResponseSchema>;
