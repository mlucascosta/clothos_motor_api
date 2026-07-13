import {
  extrairSiglaDoCNJ,
  limparCNJ,
  pareceCNJ,
} from '@infrastructure/providers/datajud/CNJHelper.js';
import type { FinderArtifact, ProcessCandidate } from './contracts.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nameFrom(data: Record<string, unknown>): string | null {
  const details = data['detalhes'];
  const candidates = [
    data['nome'],
    data['razao_social'],
    isRecord(details) ? details['nome'] : null,
  ];
  return (
    candidates.find((value): value is string => typeof value === 'string' && value.length > 0) ??
    null
  );
}

export function deriveSubjectName(
  _identifierKind: 'cpf' | 'cnpj',
  data: Record<string, unknown>,
  sourceId: string,
  sourceExecutionId: number,
): FinderArtifact | null {
  const name = nameFrom(data);
  if (name === null) return null;
  return {
    key: 'subject.name',
    value: { name },
    provenance: { sourceId, sourceExecutionId, extractor: 'subject_name/v1' },
  };
}

function processCandidates(
  data: Record<string, unknown>,
  limit: number,
): { candidates: ProcessCandidate[]; omitted: number } {
  const processes = data['processos'];
  if (!Array.isArray(processes)) return { candidates: [], omitted: 0 };

  const candidates = new Map<string, ProcessCandidate>();
  for (const process of processes) {
    if (!isRecord(process) || typeof process['numero_cnj'] !== 'string') continue;
    const cnj = process['numero_cnj'];
    if (!pareceCNJ(cnj)) continue;
    const tribunal = extrairSiglaDoCNJ(cnj);
    if (tribunal === null) continue;
    const id = limparCNJ(cnj);
    candidates.set(id, { id, cnj, tribunal });
  }

  const all = [...candidates.values()];
  return { candidates: all.slice(0, limit), omitted: Math.max(0, all.length - limit) };
}

export function deriveEscavadorArtifacts(
  data: Record<string, unknown>,
  sourceExecutionId: number,
  candidateFanoutLimit: number,
): FinderArtifact[] {
  const artifacts: FinderArtifact[] = [];
  const name = deriveSubjectName('cnpj', data, 'escavador', sourceExecutionId);
  if (name !== null) artifacts.push(name);

  const candidates = processCandidates(data, candidateFanoutLimit);
  if (candidates.candidates.length > 0) {
    artifacts.push({
      key: 'process.candidates',
      value: candidates,
      provenance: {
        sourceId: 'escavador',
        sourceExecutionId,
        extractor: 'escavador_processes/v1',
      },
    });
  }
  return artifacts;
}
