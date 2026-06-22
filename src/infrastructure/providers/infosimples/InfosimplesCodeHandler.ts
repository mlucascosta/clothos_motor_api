/**
 * @fileoverview Classificador de códigos de resposta da API Infosimples.
 *
 * A Infosimples retorna HTTP 200 em todas as chamadas e sinaliza
 * sucesso/erro via o campo `code` do body. Este módulo centraliza
 * a interpretação desse campo, evitando que uma consulta paga com
 * falha na fonte seja tratada como sucesso.
 *
 * Tabela oficial extraída de:
 * https://github.com/infosimples/infosimples-data/blob/master/lib/infosimples/data/code.rb
 *
 * @module infrastructure/providers/infosimples/InfosimplesCodeHandler
 */

import { type Either, left, right } from '@shared/domain/Either.js';
import { SourceError, type SourceErrorKind } from '@shared/domain/errors/SourceError.js';

// ---------------------------------------------------------------------------
// Tabela de códigos (nome → número) — não alterar os valores numéricos.
// ---------------------------------------------------------------------------

/**
 * Mapeamento nome→número de todos os códigos de status da API Infosimples.
 * Congelado para uso em testes, métricas e logs sem magic numbers.
 */
export const INFOSIMPLES_CODE = Object.freeze({
  single_result: 200,
  multiple_results: 201,
  unexpected_error: 600,
  unauthorized: 601,
  invalid_service: 602,
  forbidden: 603,
  invalid_request: 604,
  timeout: 605,
  empty_parameters: 606,
  invalid_parameters: 607,
  refused_parameters: 608,
  attempts_exceeded: 609,
  failed_captcha: 610,
  incomplete_data: 611,
  inexistent: 612,
  blocked_request: 613,
  try_again: 614,
  source_unavailable: 615,
  source_error: 616,
  service_overloaded: 617,
  rate_limit_exceeded: 618,
  converted_parameters: 619,
  permanent_error: 620,
  receipt_error: 621,
} as const satisfies Record<string, number>);

// ---------------------------------------------------------------------------
// Conjunto de códigos de sucesso
// ---------------------------------------------------------------------------

/**
 * Códigos que representam resultado válido e faturável.
 *
 * - 200 / 201: dado presente.
 * - 612 (inexistent): "nada consta" — resposta legítima em due diligence.
 *   Retornar Left aqui causaria retentativas indevidas e desperdício de créditos.
 * - 619 (converted_parameters): dado retornado após normalização de parâmetro.
 */
export const INFOSIMPLES_SUCCESS_CODES: ReadonlySet<number> = new Set([200, 201, 612, 619]);

// ---------------------------------------------------------------------------
// Tipo de retorno da classificação
// ---------------------------------------------------------------------------

/** Resultado de `classifyInfosimplesCode` quando o código indica sucesso. */
export type InfosimplesSuccess = { outcome: 'success' };

/** Resultado de `classifyInfosimplesCode` quando o código indica erro. */
export type InfosimplesError = { outcome: 'error'; kind: SourceErrorKind };

/** União discriminada do resultado da classificação de um code Infosimples. */
export type InfosimplesCodeOutcome = InfosimplesSuccess | InfosimplesError;

// ---------------------------------------------------------------------------
// Função de classificação
// ---------------------------------------------------------------------------

/**
 * Classifica um código de resposta Infosimples e retorna o outcome correspondente.
 *
 * Códigos desconhecidos (não listados na tabela oficial) são tratados
 * como `UPSTREAM_ERROR` por conservadorismo.
 *
 * @param code Valor numérico do campo `code` da resposta Infosimples.
 * @returns `{ outcome: 'success' }` para códigos de dado válido,
 *          `{ outcome: 'error'; kind: SourceErrorKind }` para erros.
 *
 * @example
 * classifyInfosimplesCode(200) // { outcome: 'success' }
 * classifyInfosimplesCode(612) // { outcome: 'success' } — nada consta, não é erro
 * classifyInfosimplesCode(605) // { outcome: 'error', kind: 'TIMEOUT' }
 * classifyInfosimplesCode(601) // { outcome: 'error', kind: 'AUTH_FAILED' }
 * classifyInfosimplesCode(999) // { outcome: 'error', kind: 'UPSTREAM_ERROR' }
 */
export function classifyInfosimplesCode(code: number): InfosimplesCodeOutcome {
  if (INFOSIMPLES_SUCCESS_CODES.has(code)) {
    return { outcome: 'success' };
  }

  switch (code) {
    // Transient — timeout
    case 605: // timeout
    case 614: // try_again
      return { outcome: 'error', kind: 'TIMEOUT' };

    // Transient — rate limited
    case 617: // service_overloaded
    case 618: // rate_limit_exceeded
      return { outcome: 'error', kind: 'RATE_LIMITED' };

    // Transient — upstream não disponível / bloqueou
    case 609: // attempts_exceeded
    case 610: // failed_captcha
    case 613: // blocked_request
    case 615: // source_unavailable
    case 616: // source_error
      return { outcome: 'error', kind: 'UPSTREAM_ERROR' };

    // Auth
    case 601: // unauthorized
    case 603: // forbidden
      return { outcome: 'error', kind: 'AUTH_FAILED' };

    // Todos os demais (600, 602, 604, 606, 607, 608, 611, 620, 621 e desconhecidos)
    default:
      return { outcome: 'error', kind: 'UPSTREAM_ERROR' };
  }
}

// ---------------------------------------------------------------------------
// Interface estrutural mínima para schemas Zod (igual à de parseOrSchemaError)
// ---------------------------------------------------------------------------

/**
 * Interface estrutural mínima para qualquer schema Zod (v3.25+ compatível).
 * Evita depender da hierarquia de classes interna do Zod.
 */
interface SafeParseSchema<T> {
  safeParse(
    data: unknown,
  ): { success: true; data: T } | { success: false; error: { message: string } };
}

// ---------------------------------------------------------------------------
// Função principal — drop-in replacement para parseOrSchemaError no Infosimples
// ---------------------------------------------------------------------------

/**
 * Valida o body de uma resposta Infosimples contra `schema` e classifica
 * o campo `code` para determinar sucesso ou falha.
 *
 * Substitui o padrão `parseOrSchemaError(ResponseSchema, result.value, 'infosimples')`
 * nas operations, adicionando a verificação do código de negócio que estava ausente.
 *
 * Fluxo:
 * 1. `schema.safeParse(value)` — se falhar → `Left(SCHEMA_MISMATCH)`.
 * 2. Lê `parsed.data.code` e chama `classifyInfosimplesCode`.
 * 3. Sucesso → `Right(parsed.data)`.
 * 4. Erro → monta detalhe `code=NNN <code_message> <errors[].join('; ')>` e
 *    retorna `Left(SourceError(kind, 'infosimples', detail))`.
 *
 * Os campos `code_message` e `errors` são lidos defensivamente porque o tipo
 * genérico `T` não os garante em todos os contextos.
 *
 * @param schema Schema Zod com `.safeParse` que produz objetos contendo `code: number`.
 * @param value  Valor bruto recebido do HTTP client (unknown).
 * @returns `Right<T>` em caso de sucesso; `Left<SourceError>` em caso de erro.
 *
 * @example
 * // Substitui em cada operation:
 * // return parseOrSchemaError(ResponseSchema, result.value, 'infosimples');
 * // Por:
 * return parseInfosimplesResponse(ResponseSchema, result.value);
 */
export function parseInfosimplesResponse<T extends { code: number }>(
  schema: SafeParseSchema<T>,
  value: unknown,
): Either<SourceError, T> {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    return left(new SourceError('SCHEMA_MISMATCH', 'infosimples', parsed.error.message));
  }

  const data = parsed.data;
  const outcome = classifyInfosimplesCode(data.code);

  if (outcome.outcome === 'success') {
    return right(data);
  }

  // Leitura defensiva de campos opcionais presentes na maioria das respostas
  const raw = data as Record<string, unknown>;
  const codeMessage = typeof raw['code_message'] === 'string' ? raw['code_message'] : '';
  const errors = Array.isArray(raw['errors'])
    ? (raw['errors'] as unknown[]).filter((e): e is string => typeof e === 'string').join('; ')
    : '';

  const detail = [`code=${data.code}`, codeMessage, errors]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' ');

  return left(new SourceError(outcome.kind, 'infosimples', detail));
}
