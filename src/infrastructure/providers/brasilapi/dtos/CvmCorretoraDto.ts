import { z } from 'zod';

export const CvmCorretoraSchema = z.object({
  cnpj: z.string(),
  nome_social: z.string().nullable(),
  nome_comercial: z.string().nullable(),
  tipo: z.string().nullable(),
  status: z.string().nullable(),
  codigo_cvm: z.string().nullable(),
  data_registro: z.string().nullable(),
  data_inicio_situacao: z.string().nullable(),
  data_patrimonio_liquido: z.string().nullable(),
  valor_patrimonio_liquido: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  logradouro: z.string().nullable(),
  complemento: z.string().nullable(),
  bairro: z.string().nullable(),
  cep: z.string().nullable(),
  municipio: z.string().nullable(),
  uf: z.string().nullable(),
  pais: z.string().nullable(),
});

export const CvmCorretoraListSchema = z.array(CvmCorretoraSchema);

export type CvmCorretoraDto = z.infer<typeof CvmCorretoraSchema>;
