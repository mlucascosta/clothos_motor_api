import type { ISourceExecutor } from '@application/queries/ports/ISourceExecutor.js';
import type { FinderSourceSelection } from './contracts.js';

export interface RegisteredSource {
  id: string;
  aliases?: readonly string[];
  stage: number;
  dependsOn?: readonly string[];
  requiresCandidate?: boolean;
  executor: ISourceExecutor;
  /**
   * TTL do cache compartilhado desta fonte, em segundos. O pipeline aplica o teto
   * de 7 dias (`min(cacheTtlSeconds, 604800)`). Ausente = 7 dias.
   */
  cacheTtlSeconds?: number;
}

/**
 * Entrada serializável do manifesto de adapters (§12): descreve uma fonte COM executor implementado,
 * sem expor o executor. É o artefato explícito que distingue "fonte cadastrada no catálogo Laravel"
 * de "fonte com adapter executável no motor" — comparável contra `source_definitions` num check
 * externo. NÃO inclui `executor` (não serializável).
 */
export interface SourceManifestEntry {
  id: string;
  aliases: readonly string[];
  stage: number;
  requiresCandidate: boolean;
  cacheTtlSeconds: number | null;
}

export class SourceRegistry {
  private readonly byId: ReadonlyMap<string, RegisteredSource>;

  constructor(
    sources: readonly RegisteredSource[],
    private readonly profiles: Readonly<Record<string, readonly string[]>>,
  ) {
    const entries = sources.flatMap((source) =>
      [source.id, ...(source.aliases ?? [])].map((id) => [id, source] as const),
    );
    this.byId = new Map(entries);
    if (this.byId.size !== entries.length) throw new Error('duplicate_source_id');
  }

  /**
   * Resolve um código (id canônico OU alias, ex.: `directdata_qsa`) para o id canônico da fonte
   * registrada (`directdata`). Usado para casar o plano congelado (que fala em códigos do catálogo
   * Laravel) com as fontes executadas (identificadas pelo id canônico). `undefined` = não registrada.
   */
  resolveCanonicalId(code: string): string | undefined {
    return this.byId.get(code)?.id;
  }

  /**
   * §12: manifesto EXPLÍCITO das fontes com adapter executável (uma entrada por id canônico),
   * ordenado e serializável. Um check externo pode compará-lo com o catálogo Laravel
   * (`source_definitions`) para provar que toda fonte ativa tem executor — e vice-versa.
   */
  manifest(): SourceManifestEntry[] {
    const byCanonical = new Map<string, RegisteredSource>();
    for (const source of this.byId.values()) byCanonical.set(source.id, source);

    return [...byCanonical.values()]
      .map((source) => ({
        id: source.id,
        aliases: [...(source.aliases ?? [])],
        stage: source.stage,
        requiresCandidate: source.requiresCandidate ?? false,
        cacheTtlSeconds: source.cacheTtlSeconds ?? null,
      }))
      .sort((left, right) => left.id.localeCompare(right.id));
  }

  /**
   * §12: todos os códigos (id canônico + aliases) que têm adapter executável — o conjunto
   * "executável" contra o qual os `source_code` do catálogo devem ser conferidos.
   */
  executableCodes(): string[] {
    return [...this.byId.keys()].sort();
  }

  plan(selection: FinderSourceSelection): RegisteredSource[] {
    const requested = selection.profile ? this.profiles[selection.profile] : selection.sources;
    if (requested === undefined) throw new Error('unknown_source_profile');
    if (requested.length === 0) throw new Error('empty_source_selection');

    const included = new Set<string>();
    const visiting = new Set<string>();
    const include = (sourceId: string): void => {
      if (included.has(sourceId)) return;
      if (visiting.has(sourceId)) throw new Error('source_dependency_cycle');
      const source = this.byId.get(sourceId);
      if (!source) throw new Error('unknown_source');
      visiting.add(sourceId);
      for (const dependency of source.dependsOn ?? []) {
        const dependencySource = this.byId.get(dependency);
        if (dependencySource === undefined || dependencySource.stage >= source.stage) {
          throw new Error('invalid_source_dependency_stage');
        }
        include(dependency);
      }
      visiting.delete(sourceId);
      included.add(source.id);
    };

    for (const sourceId of requested) include(sourceId);
    return [...included]
      .map((sourceId) => this.byId.get(sourceId))
      .filter((source): source is RegisteredSource => source !== undefined)
      .sort((left, right) => left.stage - right.stage || left.id.localeCompare(right.id));
  }
}
