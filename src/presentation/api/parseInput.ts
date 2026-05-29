/**
 * @fileoverview Helper de validação de input para handlers HTTP.
 * Separa a validação de input de rota (input do caller) da validação de
 * resposta de providers upstream (parseOrSchemaError em shared/).
 * Mantém o campo `details` com os issues Zod para facilitar debugging pelo caller.
 * @module presentation/api/parseInput
 */

import type { ZodType, ZodTypeDef } from 'zod';

/**
 * Resultado de validação de input de rota.
 * Discriminado por `ok` para narrowing de tipo seguro.
 *
 * @template T Tipo do dado validado em caso de sucesso
 */
export type ParseInputResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details: unknown[] };

/**
 * Valida `value` contra `schema` Zod e retorna um resultado discriminado.
 * Use em handlers HTTP para validar body/query antes de chamar operations.
 *
 * Em falha, preserva os `issues` do Zod no campo `details` para que o caller
 * possa identificar exatamente quais campos são inválidos.
 *
 * @template T Tipo inferido do schema
 * @param schema Schema Zod para validação
 * @param value Valor a validar (body, query params, etc.)
 * @param errorMessage Mensagem de erro legível para o campo `error` (default: 'Payload inválido')
 * @returns Resultado discriminado — `{ ok: true, data }` ou `{ ok: false, error, details }`
 *
 * @example
 * const result = parseInput(MySchema, await c.req.json());
 * if (!result.ok) return c.json({ error: result.error, details: result.details }, 422);
 * // result.data está tipado como MySchema
 */
export function parseInput<T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  value: unknown,
  errorMessage = 'Payload inválido',
): ParseInputResult<T> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    return { ok: false, error: errorMessage, details: parsed.error.issues };
  }
  return { ok: true, data: parsed.data };
}
