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
