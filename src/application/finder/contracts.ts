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
});

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
