/**
 * @fileoverview Normalização de movimentos processuais para o snapshot do monitor.
 *
 * Cada fonte descreve um movimento de um jeito; o Laravel deduplica por
 * `numero_cnj + codigo + data + orgao_julgador + descricao` (`ProcessEventFingerprint`).
 * Estes normalizadores são o único ponto que traduz o vocabulário do provider para
 * esses quatro campos — se um deles mudar, o fingerprint muda e o dedup quebra.
 *
 * @module application/monitor/normalize
 */

import type { MonitorMovimento, MonitorSnapshot } from './contracts.js';

function text(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/**
 * DataJud (CNJ) devolve um response Elasticsearch: `hits.hits[]._source` traz
 * `movimentos[] { codigo, nome, dataHora }` e o `orgaoJulgador { nome }` do processo —
 * o órgão vive no processo, não no movimento, então é propagado para cada movimento.
 */
export function normalizeDataJudSnapshot(data: unknown): MonitorSnapshot {
  const root = asRecord(data);
  const hits = asRecord(root?.['hits']);
  const rows = Array.isArray(hits?.['hits']) ? (hits['hits'] as unknown[]) : [];

  const movimentos: MonitorMovimento[] = [];

  for (const row of rows) {
    const source = asRecord(asRecord(row)?.['_source']);
    if (source === null) continue;

    const orgao = text(asRecord(source['orgaoJulgador'])?.['nome']);
    const items = Array.isArray(source['movimentos']) ? (source['movimentos'] as unknown[]) : [];

    for (const item of items) {
      const movimento = asRecord(item);
      if (movimento === null) continue;

      movimentos.push({
        codigo: text(movimento['codigo']),
        data: text(movimento['dataHora']),
        orgao_julgador: orgao,
        descricao: text(movimento['nome']),
      });
    }
  }

  return { movimentos };
}

/**
 * Escavador devolve `items[] { id, data, tipo, descricao }` em
 * `/api/v1/processos/{cnj}/movimentacoes`. A movimentação do Escavador não carrega o
 * órgão julgador, então `orgao_julgador` fica vazio — consistente com o fingerprint do
 * Laravel, que normaliza campo ausente para string vazia.
 */
export function normalizeEscavadorSnapshot(data: unknown): MonitorSnapshot {
  const root = asRecord(data);
  const items = Array.isArray(root?.['items']) ? (root['items'] as unknown[]) : [];

  const movimentos: MonitorMovimento[] = [];

  for (const item of items) {
    const movimento = asRecord(item);
    if (movimento === null) continue;

    movimentos.push({
      codigo: text(movimento['id']),
      data: text(movimento['data']),
      orgao_julgador: '',
      descricao: text(movimento['descricao']) || text(movimento['tipo']),
    });
  }

  return { movimentos };
}
