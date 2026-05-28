import type { ZodType } from 'zod';
import { type Either, left, right } from './Either.js';
import { SourceError } from './errors/SourceError.js';

/**
 * Valida `value` com `schema` e retorna Either.
 * Elimina o bloco safeParse → SourceError('SCHEMA_MISMATCH') repetido em todas as operations.
 */
export function parseOrSchemaError<T>(
  schema: ZodType<T, any, any>,
  value: unknown,
  source: string,
): Either<SourceError, T> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    return left(new SourceError('SCHEMA_MISMATCH', source, parsed.error.message));
  }
  return right(parsed.data as T);
}
