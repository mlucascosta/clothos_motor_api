/**
 * @fileoverview Contrato da fila `monitor` (04-MONITOR §6).
 *
 * O Laravel enfileira um poll por processo monitorado e o motor devolve o snapshot
 * normalizado. Transporte é exclusivamente o PostgreSQL core (ADR-0025): não há HTTP
 * nem callback entre Laravel e worker.
 *
 * Payload (Laravel → motor):
 *   { protocol_version: 2, operation: 'monitor_check', monitor_id, frequency, source }
 *   `jobs.identifier` carrega o número CNJ do processo.
 *
 * Resultado (motor → Laravel):
 *   { status: 'ok', snapshot: { movimentos: [...] } }
 *   Ausência de `snapshot` ⇒ o Laravel trata como `check_failed` (nada gravado nem cobrado).
 *
 * @module application/monitor/contracts
 */

/**
 * Fonte da modalidade do processo (V6 §P10; RC-2 resolvido): cada processo é Semanal
 * (CNJ/DataJud) OU Mensal (Escavador) — nunca ambos.
 */
export type MonitorSource = 'cnj' | 'escavador';

export interface MonitorJobPayload {
  readonly monitorId: number;
  readonly frequency: 'weekly' | 'monthly';
  readonly source: MonitorSource;
}

/**
 * Movimento normalizado. Os cinco campos que o Laravel usa no fingerprint de dedup
 * (`ProcessEventFingerprint`) são `numero_cnj` (do monitor) + estes quatro.
 */
export interface MonitorMovimento {
  readonly codigo: string;
  readonly data: string;
  readonly orgao_julgador: string;
  readonly descricao: string;
}

export interface MonitorSnapshot {
  readonly movimentos: readonly MonitorMovimento[];
}

/**
 * Valida e normaliza o payload do job. Falha fechado: um payload que não seja
 * exatamente um `monitor_check` do protocolo 2 é rejeitado em vez de assumir defaults.
 *
 * @throws {Error} `invalid_monitor_payload` quando o payload não adere ao contrato.
 */
export function parseMonitorJobPayload(input: unknown): MonitorJobPayload {
  if (typeof input !== 'object' || input === null) {
    throw new Error('invalid_monitor_payload');
  }

  const payload = input as Record<string, unknown>;

  if (payload['protocol_version'] !== 2 || payload['operation'] !== 'monitor_check') {
    throw new Error('invalid_monitor_payload');
  }

  const monitorId = payload['monitor_id'];
  if (typeof monitorId !== 'number' || !Number.isInteger(monitorId)) {
    throw new Error('invalid_monitor_payload');
  }

  const frequency = payload['frequency'];
  if (frequency !== 'weekly' && frequency !== 'monthly') {
    throw new Error('invalid_monitor_payload');
  }

  const source = payload['source'];
  if (source !== 'cnj' && source !== 'escavador') {
    throw new Error('invalid_monitor_payload');
  }

  // A modalidade define a fonte (V6 §P10). Um par incoerente indica corrupção do
  // contrato entre os dois lados — falha em vez de silenciosamente pesquisar a fonte errada.
  const expected: MonitorSource = frequency === 'monthly' ? 'escavador' : 'cnj';
  if (source !== expected) {
    throw new Error('invalid_monitor_payload');
  }

  return { monitorId, frequency, source };
}
