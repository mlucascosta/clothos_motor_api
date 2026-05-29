import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

/**
 * Opções de configuração para uma requisição HTTP.
 *
 * @interface HttpRequestOptions
 */
export interface HttpRequestOptions {
  /**
   * Método HTTP a usar.
   * @default 'GET'
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  /**
   * Parâmetros de query string.
   * Valores undefined são filtrados automaticamente.
   *
   * @example
   * { identifier: 'xyz', active: true }
   * // Resulta em: ?identifier=xyz&active=true
   */
  params?: Record<string, string | number | boolean | undefined>;

  /**
   * Corpo da requisição.
   * Será serializado como JSON automaticamente.
   */
  body?: unknown;

  /**
   * Tempo máximo em milissegundos para aguardar a resposta.
   * @default 30000 (30 segundos) — pode ser sobrescrito pela config do cliente
   */
  timeoutMs?: number;

  /**
   * Headers customizados adicionais.
   * Sobrescrevem headers padrão do cliente.
   *
   * @example
   * { 'X-Custom-Header': 'valor' }
   */
  headers?: Record<string, string>;
}

/**
 * Interface abstrata para cliente HTTP que retorna resultados com tratamento de erro estruturado.
 *
 * Implementações devem:
 * - Usar Fetch API ou equivalente
 * - Retornar Left<SourceError> para erros de conexão, timeout, autenticação, rate limiting
 * - Retornar Right<T> para respostas bem-sucedidas (2xx)
 * - Validar e parsear respostas JSON
 * - Aplicar defaults de headers, timeouts e baseUrl
 *
 * @interface IHttpClient
 *
 * @example
 * const client: IHttpClient = new FetchHttpClient({
 *   baseUrl: 'https://api.provider.com',
 *   defaultTimeoutMs: 15000,
 * });
 *
 * const result = await client.request<PersonResponse>('/person', {
 *   params: { id: 'person-id' },
 *   timeoutMs: 10000,
 * });
 *
 * if (isRight(result)) {
 *   console.log('Pessoa encontrada:', result.value);
 * } else {
 *   console.error('Erro:', result.value.kind, result.value.cause);
 * }
 */
export interface IHttpClient {
  /**
   * Executa uma requisição HTTP e retorna Either com resultado ou erro.
   *
   * @template T Tipo esperado da resposta JSON (após parsing)
   * @param path Caminho relativo (ex: '/person') — será prefixado com baseUrl
   * @param options Opções de requisição
   * @returns Promise com Either contendo sucesso (Right<T>) ou erro (Left<SourceError>)
   *
   * @example
   * // GET simples
   * const result = await client.request<{ id: number }>('/users/123');
   *
   * @example
   * // POST com body e headers customizados
   * const result = await client.request<{ created: boolean }>('/users', {
   *   method: 'POST',
   *   body: { name: 'João', email: 'joao@example.com' },
   *   headers: { 'X-Api-Key': process.env.API_KEY },
   * });
   *
   * @example
   * // Com query params e timeout custom
   * const result = await client.request<Person[]>('/search', {
   *   params: { q: 'acme', limit: 10 },
   *   timeoutMs: 5000,
   * });
   */
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>>;

  /**
   * Executa uma requisição HTTP e retorna dados binários brutos (ArrayBuffer).
   *
   * Útil para downloads de arquivos (PDF, imagens, binários).
   * Não faz parsing JSON; retorna resposta bruta como ArrayBuffer.
   *
   * @param path Caminho relativo (ex: '/docs/123/download') — será prefixado com baseUrl
   * @param options Opções de requisição
   * @returns Promise com Either contendo sucesso (Right<ArrayBuffer>) ou erro (Left<SourceError>)
   *
   * @example
   * // Download de PDF
   * const result = await client.requestRaw('/documents/123/download');
   *
   * if (isRight(result)) {
   *   const buffer = result.value;
   *   // ... processar arquivo
   * }
   */
  requestRaw(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, ArrayBuffer>>;
}
