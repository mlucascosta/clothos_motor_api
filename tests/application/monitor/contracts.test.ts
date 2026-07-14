import { parseMonitorJobPayload } from '@application/monitor/contracts.js';
import {
  normalizeDataJudSnapshot,
  normalizeEscavadorSnapshot,
} from '@application/monitor/normalize.js';

const validPayload = {
  protocol_version: 2,
  operation: 'monitor_check',
  monitor_id: 42,
  frequency: 'daily',
  source: 'cnj',
};

describe('parseMonitorJobPayload', () => {
  it('aceita o payload do contrato e normaliza os campos', () => {
    expect(parseMonitorJobPayload(validPayload)).toEqual({
      monitorId: 42,
      frequency: 'daily',
      source: 'cnj',
    });
  });

  it('aceita a modalidade semanal com fonte escavador', () => {
    expect(
      parseMonitorJobPayload({ ...validPayload, frequency: 'weekly', source: 'escavador' }),
    ).toEqual({ monitorId: 42, frequency: 'weekly', source: 'escavador' });
  });

  it('rejeita par modalidade/fonte incoerente em vez de consultar a fonte errada', () => {
    // Semanal é Escavador e Diário é CNJ (04-MONITOR §1). Um par cruzado significa
    // contrato corrompido — pesquisar a fonte errada geraria eventos falsos.
    expect(() => parseMonitorJobPayload({ ...validPayload, frequency: 'weekly' })).toThrow(
      'invalid_monitor_payload',
    );
    expect(() => parseMonitorJobPayload({ ...validPayload, source: 'escavador' })).toThrow(
      'invalid_monitor_payload',
    );
  });

  it.each([
    ['protocolo diferente', { ...validPayload, protocol_version: 1 }],
    ['operação diferente', { ...validPayload, operation: 'finder' }],
    ['monitor_id ausente', { ...validPayload, monitor_id: undefined }],
    ['monitor_id não inteiro', { ...validPayload, monitor_id: 1.5 }],
    ['frequência desconhecida', { ...validPayload, frequency: 'hourly' }],
    ['fonte desconhecida', { ...validPayload, source: 'directdata' }],
    ['não-objeto', 'monitor_check'],
    ['nulo', null],
  ])('falha fechado: %s', (_label, input) => {
    expect(() => parseMonitorJobPayload(input)).toThrow('invalid_monitor_payload');
  });
});

describe('normalizeDataJudSnapshot', () => {
  it('achata os movimentos do hit e propaga o órgão julgador do processo', () => {
    const snapshot = normalizeDataJudSnapshot({
      hits: {
        hits: [
          {
            _source: {
              orgaoJulgador: { nome: '1ª Vara Cível' },
              movimentos: [
                { codigo: 26, nome: 'Distribuição', dataHora: '2026-05-20T10:00:00Z' },
                { codigo: 51, nome: 'Sentença', dataHora: '2026-06-01T09:00:00Z' },
              ],
            },
          },
        ],
      },
    });

    expect(snapshot.movimentos).toEqual([
      {
        codigo: '26',
        data: '2026-05-20T10:00:00Z',
        orgao_julgador: '1ª Vara Cível',
        descricao: 'Distribuição',
      },
      {
        codigo: '51',
        data: '2026-06-01T09:00:00Z',
        orgao_julgador: '1ª Vara Cível',
        descricao: 'Sentença',
      },
    ]);
  });

  it('devolve lista vazia quando o processo não tem movimento ou o shape é inesperado', () => {
    expect(normalizeDataJudSnapshot({ hits: { hits: [] } }).movimentos).toEqual([]);
    expect(normalizeDataJudSnapshot({}).movimentos).toEqual([]);
    expect(normalizeDataJudSnapshot(null).movimentos).toEqual([]);
  });
});

describe('normalizeEscavadorSnapshot', () => {
  it('mapeia items para o vocabulário do fingerprint', () => {
    const snapshot = normalizeEscavadorSnapshot({
      items: [{ id: 999, data: '2026-05-20', tipo: 'Sentença', descricao: 'Julgado procedente' }],
    });

    expect(snapshot.movimentos).toEqual([
      {
        codigo: '999',
        data: '2026-05-20',
        orgao_julgador: '',
        descricao: 'Julgado procedente',
      },
    ]);
  });

  it('usa o tipo como descrição quando a descrição vem vazia', () => {
    const snapshot = normalizeEscavadorSnapshot({
      items: [{ id: 1, data: '2026-05-20', tipo: 'Despacho', descricao: null }],
    });

    expect(snapshot.movimentos[0]?.descricao).toBe('Despacho');
  });

  it('devolve lista vazia para shape inesperado', () => {
    expect(normalizeEscavadorSnapshot({}).movimentos).toEqual([]);
    expect(normalizeEscavadorSnapshot(null).movimentos).toEqual([]);
  });
});
