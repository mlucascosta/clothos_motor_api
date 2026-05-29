import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import { isLeft } from '../../../../shared/domain/Either.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

export const ApiBrasilSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type ApiBrasilSuccess = z.infer<typeof ApiBrasilSuccessSchema>;

export function parseApiBrasilResponse<T>(
  response: unknown,
  sourceName: string,
): Either<SourceError, { success: boolean; message?: string; data: T }> {
  return parseOrSchemaError(
    z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z.unknown().optional(),
    }),
    response,
    sourceName,
  ) as unknown as Either<SourceError, { success: boolean; message?: string; data: T }>;
}
