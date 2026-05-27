export type SourceErrorKind =
  | 'TIMEOUT'
  | 'SCHEMA_MISMATCH'
  | 'AUTH_FAILED'
  | 'CIRCUIT_OPEN'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'UPSTREAM_ERROR';

export class SourceError extends Error {
  constructor(
    readonly kind: SourceErrorKind,
    readonly source: string,
    override readonly cause?: unknown,
  ) {
    super(`[${source}] ${kind}${cause ? `: ${String(cause)}` : ''}`);
    this.name = 'SourceError';
  }
}
