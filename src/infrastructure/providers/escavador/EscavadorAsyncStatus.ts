/**
 * @fileoverview Classificador de status de processamento assíncrono do Escavador.
 *
 * As operações assíncronas do Escavador (busca de processos, atualização,
 * resumo por IA) retornam HTTP 200 com um campo `status` no corpo que indica
 * o estado do processamento. O valor chega com casing e acentuação variáveis
 * entre endpoints/versões (ex.: `SUCESSO`, `concluido`, `em_andamento`,
 * `NAO_ENCONTRADO`). Este módulo centraliza a normalização e a classificação
 * desse campo para evitar dois riscos opostos:
 *
 * - Falso-sucesso: aceitar uma busca que terminou em erro.
 * - Falso-fracasso: rejeitar (via enum estrito) um resultado válido e já pago
 *   só porque o status veio com casing/valor inesperado.
 *
 * Falhas de transporte (HTTP não-2xx, timeout) NÃO passam por aqui — já são
 * convertidas em `Left(SourceError)` pelo FetchHttpClient. Este classificador
 * trata apenas o estado de negócio carregado em respostas 200.
 *
 * @module infrastructure/providers/escavador/EscavadorAsyncStatus
 */

/**
 * Desfecho de um status assíncrono do Escavador.
 *
 * - `success`: processamento concluído com resultado disponível.
 * - `failed`: processamento terminou em erro.
 * - `not_found`: busca concluída sem nada encontrado (resultado vazio legítimo).
 * - `pending`: ainda em andamento — continuar fazendo polling.
 * - `unknown`: status não reconhecido — tratar conservadoramente como pending.
 */
export type EscavadorAsyncOutcome = 'success' | 'failed' | 'not_found' | 'pending' | 'unknown';

/**
 * Normaliza um status bruto: trim, uppercase e remoção de acentos (NFD).
 * Centraliza a normalização que antes vivia inline no EscavadorExecutor.
 *
 * @param raw Status bruto recebido da API (qualquer casing/acentuação).
 * @returns Status normalizado em UPPERCASE sem acentos (ex.: `CONCLUIDO`).
 *
 * @example
 * normalizeEscavadorStatus('concluído') // 'CONCLUIDO'
 * normalizeEscavadorStatus(' Em_Andamento ') // 'EM_ANDAMENTO'
 */
export function normalizeEscavadorStatus(raw: string): string {
  return (
    raw
      .trim()
      .toUpperCase()
      .normalize('NFD')
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: remoção intencional de marcas diacríticas combinantes pós-NFD (strip de acentos)
      .replace(/[̀-ͯ]/g, '')
  );
}

/**
 * Conjuntos de status conhecidos (já normalizados).
 *
 * Fundamentados nos valores efetivamente tratados pelo EscavadorExecutor
 * (`SUCESSO`, `CONCLUIDO`, `ERRO`, `NAO_ENCONTRADO`) e nos vocabulários
 * declarados nos DTOs/docs (`pendente`, `em_andamento`, `concluido`, `erro`,
 * `processando`, `em_processamento`).
 */
const SUCCESS_STATUSES: ReadonlySet<string> = new Set([
  'SUCESSO',
  'CONCLUIDO',
  'PROCESSADO',
  'FINALIZADO',
  'DISPONIVEL',
]);

const FAILED_STATUSES: ReadonlySet<string> = new Set(['ERRO', 'FALHA', 'CANCELADO']);

const NOT_FOUND_STATUSES: ReadonlySet<string> = new Set(['NAO_ENCONTRADO', 'SEM_RESULTADO']);

const PENDING_STATUSES: ReadonlySet<string> = new Set([
  'PENDENTE',
  'EM_ANDAMENTO',
  'EM_PROCESSAMENTO',
  'PROCESSANDO',
  'AGUARDANDO',
  'ENVIADO',
]);

/**
 * Classifica um status assíncrono do Escavador em um desfecho.
 *
 * Status desconhecidos retornam `unknown` — o chamador deve tratá-los de forma
 * conservadora (continuar o polling), nunca como sucesso.
 *
 * @param raw Valor bruto do campo `status` da resposta.
 * @returns Desfecho classificado.
 *
 * @example
 * classifyEscavadorStatus('SUCESSO')        // 'success'
 * classifyEscavadorStatus('concluido')      // 'success'
 * classifyEscavadorStatus('erro')           // 'failed'
 * classifyEscavadorStatus('NAO_ENCONTRADO') // 'not_found'
 * classifyEscavadorStatus('em_andamento')   // 'pending'
 * classifyEscavadorStatus('foo')            // 'unknown'
 */
export function classifyEscavadorStatus(raw: string): EscavadorAsyncOutcome {
  const status = normalizeEscavadorStatus(raw);

  if (SUCCESS_STATUSES.has(status)) return 'success';
  if (FAILED_STATUSES.has(status)) return 'failed';
  if (NOT_FOUND_STATUSES.has(status)) return 'not_found';
  if (PENDING_STATUSES.has(status)) return 'pending';
  return 'unknown';
}
