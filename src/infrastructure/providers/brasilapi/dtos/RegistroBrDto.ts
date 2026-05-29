import { z } from 'zod';

export const RegistroBrSchema = z.object({
  status_code: z.number(),
  status: z.string(),
  fqdn: z.string(),
  hosts: z.array(z.string()).default([]),
  publication_status: z.string().nullable(),
  expires_at: z.string().nullable(),
  suggestions: z.array(z.string()).default([]),
});

export type RegistroBrDto = z.infer<typeof RegistroBrSchema>;
