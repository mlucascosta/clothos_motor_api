import { z } from 'zod';

export const InstituicaoDtoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  cnpj: z.string().optional(),
  tipo: z.string().optional(),
  quantidade_processos: z.number().int().min(0).optional(),
  url_escavador: z.string().optional(),
});

export const InstituicaoPessoaSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  cpf: z.string().optional(),
  cargo: z.string().optional(),
  data_entrada: z.string().optional(),
  data_saida: z.string().optional(),
});

export const InstituicaoPessoasResponseSchema = z.object({
  items: z.array(InstituicaoPessoaSchema),
  total: z.number().int().min(0),
  pagina: z.number().int().min(1).optional(),
  paginas: z.number().int().min(0).optional(),
});

export type InstituicaoDto = z.infer<typeof InstituicaoDtoSchema>;
export type InstituicaoPessoa = z.infer<typeof InstituicaoPessoaSchema>;
export type InstituicaoPessoasResponse = z.infer<typeof InstituicaoPessoasResponseSchema>;
