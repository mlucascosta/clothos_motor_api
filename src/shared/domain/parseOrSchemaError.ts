import { type Either, left, right } from './Either.js';
import { SourceError } from './errors/SourceError.js';

/**
 * Interface estrutural mínima para qualquer schema Zod (v3.25+ compatível).
 * Evita depender da hierarquia de classes interna do Zod.
 */
interface SafeParseSchema<T> {
  safeParse(data: unknown):
    | { success: true; data: T }
    | { success: false; error: { message: string } };
}

/**
 * Valida `value` com `schema` e retorna Either.
 * Elimina o bloco safeParse → SourceError('SCHEMA_MISMATCH') repetido em todas as operations.
 */
export function parseOrSchemaError<T>(
  schema: SafeParseSchema<T>,
  value: unknown,
  source: string,
): Either<SourceError, T> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    return left(new SourceError('SCHEMA_MISMATCH', source, parsed.error.message));
  }
  return right(parsed.data);
}
