/**
 * @fileoverview Redação de credenciais em texto livre (mensagens de erro de rede).
 *
 * Motivo: `SourceError.message` propaga até `job_source_executions`/eventos de job,
 * que são lidos por operação e pelo Laravel. Qualquer credencial que caia numa
 * mensagem de exceção (URL malformada, erro de DNS carregando a URL completa,
 * dump de header pelo runtime) vira segredo persistido em banco.
 *
 * Regra do projeto: segredos nunca entram em código, logs ou commits.
 *
 * Estratégia: bloquear por FORMA (querystring, header, campo JSON, scheme de
 * autorização) e não por lista fechada de nomes. O casamento do nome é por
 * SUBSTRING (`access_token`, `client_secret`, `X-API-Key` casam), porque a lista
 * fechada anterior deixava passar todos os prefixados.
 *
 * @module shared/infrastructure/redactSecrets
 */

/** Marcador que substitui o valor sensível. Mantém o nome do campo para diagnóstico. */
const MASK = '[REDACTED]';

/**
 * Núcleos que tornam um nome de campo sensível. Casam como substring, então
 * `access_token`, `refresh_token`, `client_secret` e `X-API-Key` são cobertos
 * sem precisar enumerá-los.
 */
const SENSITIVE_CORE = 'token|key|secret|password|passwd|credential|authorization|signature|sig';

/** Schemes de autorização cujo valor seguinte é sempre credencial. */
const AUTH_SCHEMES = 'Bearer|APIKey|Basic|Digest|Token';

/**
 * Parâmetro de querystring cujo nome contém núcleo sensível.
 * Ancorado em `?`/`&` e no `=`; consome até o próximo `&` ou espaço.
 */
const QUERY_PARAM = new RegExp(
  `([?&][\\w.\\-\\[\\]]*(?:${SENSITIVE_CORE})[\\w.\\-\\[\\]]*=)[^&\\s]*`,
  'gi',
);

/**
 * Header no formato `Nome: valor`. Consome até vírgula, quebra de linha ou fim.
 * Cobre `Authorization: Bearer x`, `X-API-Key: x`, `DeviceToken: x`.
 */
const HEADER_FIELD = new RegExp(`([\\w-]*(?:${SENSITIVE_CORE})[\\w-]*\\s*:\\s*)[^,\\n]+`, 'gi');

/**
 * Scheme de autorização solto, sem nome de header antes.
 * Rede de segurança para mensagens que carregam só o valor.
 */
const AUTH_SCHEME = new RegExp(`\\b(${AUTH_SCHEMES})\\s+[A-Za-z0-9._~+/=-]+`, 'gi');

/**
 * Campo JSON cujo nome contém núcleo sensível — `{"apiKey":"x"}`.
 * Separado do header porque o valor é delimitado por aspas, não por vírgula.
 */
const JSON_FIELD = new RegExp(
  `("[\\w.\\-]*(?:${SENSITIVE_CORE})[\\w.\\-]*"\\s*:\\s*)"[^"]*"`,
  'gi',
);

/**
 * Remove credenciais de uma mensagem de texto livre.
 *
 * Preserva o nome do campo (`access_token=[REDACTED]`) para que a mensagem
 * continue diagnosticável sem expor o valor.
 *
 * @param {string} message - Texto potencialmente contendo credencial.
 * @returns {string} Texto com todo valor sensível substituído por `[REDACTED]`.
 *
 * @example
 * redactSecrets('https://api.x/v1?access_token=sk_live_abc')
 * // 'https://api.x/v1?access_token=[REDACTED]'
 */
export function redactSecrets(message: string): string {
  return message
    .replace(JSON_FIELD, `$1"${MASK}"`)
    .replace(QUERY_PARAM, `$1${MASK}`)
    .replace(HEADER_FIELD, `$1${MASK}`)
    .replace(AUTH_SCHEME, `$1 ${MASK}`);
}

/**
 * Extrai mensagem segura de um erro desconhecido capturado em `catch`.
 *
 * @param {unknown} err - Valor capturado.
 * @returns {string} Mensagem já redigida, ou `'network error'` se não for `Error`.
 */
export function safeErrorMessage(err: unknown): string {
  return err instanceof Error ? redactSecrets(err.message) : 'network error';
}
