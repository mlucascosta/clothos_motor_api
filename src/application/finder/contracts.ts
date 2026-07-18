import { z } from 'zod';

const sourceSelectionSchema = z
  .object({
    profile: z.string().min(1).optional(),
    sources: z.array(z.string().min(1)).min(1).optional(),
  })
  .superRefine((selection, context) => {
    if ((selection.profile === undefined) === (selection.sources === undefined)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'select profile or sources' });
    }
  });

/**
 * Perfil do investigado (data de nascimento, nome da mãe, etc.) CIFRADO, exigido por certas
 * fontes. O Laravel obriga e cifra no submit (SubjectProfileField); o motor decifra em memória
 * com a chave apontada por key_id. Presente apenas quando alguma fonte selecionada exige perfil.
 */
export const subjectProfileSchema = z
  .object({ ciphertext: z.string().min(1), key_id: z.string().min(1) })
  .strict();

/**
 * Plano de execução CONGELADO por produto (B4.5). O Laravel (dono do catálogo) resolve o bundle e
 * congela os passos: qual fonte, se é essencial (`required`) e a que grupo de fallback pertence. O
 * motor executa exatamente isto — não consulta catálogo — e devolve cobertura/lacunas. Um
 * `fallback_group` é UM requisito satisfeito por qualquer membro: o motor pula os demais membros do
 * grupo assim que um deles entrega (economia de COGS).
 */
export const executionStepSchema = z
  .object({
    source_code: z.string().min(1),
    required: z.boolean(),
    fallback_group: z.string().min(1).nullable(),
    order: z.number().int().nonnegative(),
    // Peso do componente na cobertura ponderada (REGRAS §14). Ausente = 1 (contagem simples).
    weight: z.number().int().positive().optional(),
  })
  .strict();

export const executionPlanSchema = z
  .object({
    product_code: z.string().min(1),
    steps: z.array(executionStepSchema).min(1),
  })
  .strict();

export const FinderJobPayloadSchema = z.object({
  protocol_version: z.literal(2),
  operation: z.enum(['full_query', 'lite_query']),
  identifier: z.union([
    z.object({ kind: z.literal('cnpj'), value: z.string().regex(/^[A-Za-z0-9]{14}$/) }).strict(),
    z
      .object({ kind: z.literal('cpf'), ciphertext: z.string().min(1), key_id: z.string().min(1) })
      .strict(),
  ]),
  source_selection: sourceSelectionSchema,
  selected_candidate_ids: z.array(z.string().min(1)).optional(),
  subject_profile: subjectProfileSchema.optional(),
  execution_plan: executionPlanSchema.optional(),
});

export type ExecutionStep = z.infer<typeof executionStepSchema>;
export type ExecutionPlan = z.infer<typeof executionPlanSchema>;

export type FinderJobPayload = z.infer<typeof FinderJobPayloadSchema>;
export type FinderSourceSelection = FinderJobPayload['source_selection'];

export interface FinderArtifact {
  key: string;
  value: Record<string, unknown>;
  provenance: {
    sourceId: string;
    sourceExecutionId: number;
    extractor: string;
  };
}

export interface ProcessCandidate {
  id: string;
  cnj: string;
  tribunal: string;
}

export function parseFinderJobPayload(input: unknown): FinderJobPayload {
  const parsed = FinderJobPayloadSchema.safeParse(input);
  if (!parsed.success) {
    // Never include payload or Zod diagnostics here: they could contain protected identifiers.
    throw new Error('invalid_protocol_v2');
  }
  return parsed.data;
}
