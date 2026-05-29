import { type Either, left, right } from '../domain/Either.js';
import { SourceError } from '../domain/errors/SourceError.js';
import type { HttpRequestOptions, IHttpClient } from './IHttpClient.js';

/**
 * Configuração para cliente HTTP baseado em Fetch API.
 *
 * @interface FetchHttpClientConfig
 */
export interface FetchHttpClientConfig {
  /**
   * URL base que será prefixada a todos os paths.
   * Trailing slashes são removidos automaticamente.
   *
   * @example 'https://api.provider.com' ou 'https://api.provider.com/'
   */
  baseUrl: string;

  /**
   * Headers padrão incluídos em toda requisição.
   * Podem ser sobrescritos por headers em HttpRequestOptions.
   *
   * @example { 'Authorization': 'Bearer token', 'X-Request-Id': 'uuid' }
   */
  defaultHeaders?: Record<string, string>;

  /**
   * Timeout padrão em milissegundos para todas as requisições.
   * Pode ser sobrescrito em HttpRequestOptions.timeoutMs.
   *
   * @default 30000 (30 segundos)
   */
  defaultTimeoutMs?: number;

  /**
   * Nome identificador da fonte para logs e tratamento de erro.
   * Aparece na mensagem de SourceError.
   *
   * @example 'google-maps', 'api-v2', 'crm-provider'
   * @default 'http'
   */
  sourceName?: string;
}

/**
 * Implementação concreta de IHttpClient usando Fetch API.
 *
 * Responsabilidades:
 * - Construir URLs com baseUrl, path e query params
 * - Serializar body como JSON
 * - Aplicar timeouts via AbortSignal
 * - Classificar erros HTTP em SourceErrorKind apropriado
 * - Parsear e retornar respostas JSON
 * - Mesclar headers padrão com headers request
 *
 * @implements {IHttpClient}
 *
 * @example
 * const client = new FetchHttpClient({
 *   baseUrl: 'https://api.example.com',
 *   defaultTimeoutMs: 10000,
 *   sourceName: 'external-api',
 *   defaultHeaders: { 'X-Custom': 'value' },
 * });
 *
 * const result = await client.request<{ status: string }>('/status');
 * if (isRight(result)) {
 *   console.log('API status:', result.value);
 * }
 */
export class FetchHttpClient implements IHttpClient {
  /**
   * @param config Configuração do cliente HTTP
   */
  constructor(private readonly config: FetchHttpClientConfig) {}

  /**
   * Executa uma requisição HTTP com tratamento automático de erros.
   *
   * Errors tratados:
   * - TimeoutError (AbortSignal timeout) → TIMEOUT
   * - 401/403 → AUTH_FAILED
   * - 404 → NOT_FOUND
   * - 429 → RATE_LIMITED
   * - Outros erros HTTP (5xx, etc) → UPSTREAM_ERROR
   * - Erros de rede/parsing → UPSTREAM_ERROR
   *
   * @template T Tipo da resposta esperada (JSON)
   * @param path Caminho relativo (ex: '/users/123')
   * @param options Opções de requisição (método, body, headers, etc)
   * @returns Either contendo sucesso ou erro estruturado
   */
  async request<T>(
    path: string,
    options: HttpRequestOptions = {},
  ): Promise<Either<SourceError, T>> {
    const url = this.buildUrl(path, options.params);
    const timeoutMs = options.timeoutMs ?? this.config.defaultTimeoutMs ?? 30_000;
    const source = this.config.sourceName ?? 'http';

    try {
      const init: RequestInit = {
        method: options.method ?? 'GET',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...this.config.defaultHeaders,
          ...options.headers,
        },
      };
      if (options.body !== undefined) {
        init.body = JSON.stringify(options.body);
      }
      const response = await fetch(url, init);

      if (response.status === 401 || response.status === 403) {
        return left(new SourceError('AUTH_FAILED', source, `HTTP ${response.status}`));
      }

      if (response.status === 404) {
        return left(new SourceError('NOT_FOUND', source));
      }

      if (response.status === 429) {
        return left(new SourceError('RATE_LIMITED', source));
      }

      if (!response.ok) {
        return left(new SourceError('UPSTREAM_ERROR', source, `HTTP ${response.status}`));
      }

      if (response.status === 204 || response.status === 205) {
        return right(undefined as unknown as T);
      }

      const data = (await response.json()) as T;
      return right(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        return left(new SourceError('TIMEOUT', source));
      }
      const safeMsg = err instanceof Error
        ? err.message.replace(/([?&])(TOKEN|token|apikey|api_key|key|secret|password|passwd)=[^&\s]*/gi, '$1$2=[REDACTED]')
        : 'network error';
      return left(new SourceError('UPSTREAM_ERROR', source, safeMsg));
    }
  }

  /**
   * Executa uma requisição HTTP e retorna dados binários brutos (ArrayBuffer).
   *
   * Idêntico ao request() mas sem parsing JSON.
   * Retorna a resposta bruta como ArrayBuffer.
   *
   * Errors tratados:
   * - Mesmos casos que request() (timeout, auth, rate-limit, etc)
   *
   * @param path Caminho relativo (ex: '/docs/download')
   * @param options Opções de requisição
   * @returns Either contendo sucesso (ArrayBuffer) ou erro estruturado
   */
  async requestRaw(
    path: string,
    options: HttpRequestOptions = {},
  ): Promise<Either<SourceError, ArrayBuffer>> {
    const url = this.buildUrl(path, options.params);
    const timeoutMs = options.timeoutMs ?? this.config.defaultTimeoutMs ?? 30_000;
    const source = this.config.sourceName ?? 'http';

    try {
      const init: RequestInit = {
        method: options.method ?? 'GET',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          ...this.config.defaultHeaders,
          ...options.headers,
        },
      };
      if (options.body !== undefined) {
        init.body = JSON.stringify(options.body);
      }
      const response = await fetch(url, init);

      if (response.status === 401 || response.status === 403) {
        return left(new SourceError('AUTH_FAILED', source, `HTTP ${response.status}`));
      }

      if (response.status === 404) {
        return left(new SourceError('NOT_FOUND', source));
      }

      if (response.status === 429) {
        return left(new SourceError('RATE_LIMITED', source));
      }

      if (!response.ok) {
        return left(new SourceError('UPSTREAM_ERROR', source, `HTTP ${response.status}`));
      }

      const buffer = await response.arrayBuffer();
      return right(buffer);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        return left(new SourceError('TIMEOUT', source));
      }
      const safeMsg = err instanceof Error
        ? err.message.replace(/([?&])(TOKEN|token|apikey|api_key|key|secret|password|passwd)=[^&\s]*/gi, '$1$2=[REDACTED]')
        : 'network error';
      return left(new SourceError('UPSTREAM_ERROR', source, safeMsg));
    }
  }

  /**
   * Constrói URL completa a partir de baseUrl, path e query params.
   *
   * Comportamento:
   * - Remove trailing slash de baseUrl
   * - Normaliza path (adiciona leading / se necessário)
   * - Filtra params undefined antes de serializar
   * - URL-encoda keys e values
   *
   * @param path Caminho relativo
   * @param params Query parameters opcionais
   * @returns URL completa
   *
   * @example
   * buildUrl('/users', { id: 123, active: true })
   * // 'https://api.example.com/users?id=123&active=true'
   *
   * @example
   * buildUrl('search', { q: 'hello world', skip: undefined })
   * // 'https://api.example.com/search?q=hello%20world'
   */
  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${base}${normalizedPath}`;

    if (!params) return url;

    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');

    return qs ? `${url}?${qs}` : url;
  }
}
