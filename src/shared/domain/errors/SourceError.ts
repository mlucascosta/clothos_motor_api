/**
 * Tipos de erro que podem ocorrer ao integrar com fontes de dados externas.
 * Cada tipo representa uma classe específica de falha.
 *
 * - `TIMEOUT`: Requisição excedeu o tempo limite de espera
 * - `SCHEMA_MISMATCH`: Resposta da fonte não corresponde ao esquema esperado
 * - `AUTH_FAILED`: Falha na autenticação (401/403)
 * - `CIRCUIT_OPEN`: Circuit breaker aberto para a fonte (muitas falhas recentes)
 * - `RATE_LIMITED`: Limite de requisições excedido (HTTP 429)
 * - `NOT_FOUND`: Recurso não encontrado (HTTP 404)
 * - `UPSTREAM_ERROR`: Erro genérico na fonte (5xx ou outro)
 */
export type SourceErrorKind =
  | 'TIMEOUT'
  | 'SCHEMA_MISMATCH'
  | 'AUTH_FAILED'
  | 'CIRCUIT_OPEN'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'UPSTREAM_ERROR';

/**
 * Erro padronizado para falhas ao consultar fontes de dados externas.
 * Encapsula informações sobre o tipo de erro, a fonte que falhou e a causa raiz.
 *
 * Usado em conjunto com Either<SourceError, T> para representar resultados
 * que podem falhar graciosamente durante a integração com providers.
 *
 * @example
 * // Erro de timeout
 * const err = new SourceError('TIMEOUT', 'google-maps', 'AbortSignal timeout');
 * console.log(err.message); // '[google-maps] TIMEOUT: AbortSignal timeout'
 *
 * @example
 * // Erro de autenticação
 * const err = new SourceError('AUTH_FAILED', 'api-v2', new Error('Invalid API key'));
 * console.error(err.kind); // 'AUTH_FAILED'
 */
export class SourceError extends Error {
  /**
   * @param kind Tipo específico de erro ocorrido
   * @param source Nome identificador da fonte/provider que falhou
   * @param cause Informação adicional sobre a causa raiz (opcional)
   */
  constructor(
    readonly kind: SourceErrorKind,
    readonly source: string,
    override readonly cause?: unknown,
  ) {
    super(`[${source}] ${kind}${cause ? `: ${String(cause)}` : ''}`);
    this.name = 'SourceError';
  }
}
