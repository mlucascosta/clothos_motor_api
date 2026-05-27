import { SourceError } from '../../../src/shared/domain/errors/SourceError';

describe('SourceError', () => {
  it('cria com kind e source corretos', () => {
    const err = new SourceError('TIMEOUT', 'escavador');
    expect(err.kind).toBe('TIMEOUT');
    expect(err.source).toBe('escavador');
    expect(err.name).toBe('SourceError');
    expect(err.message).toContain('[escavador]');
    expect(err.message).toContain('TIMEOUT');
  });

  it('inclui cause na mensagem quando fornecido', () => {
    const err = new SourceError('UPSTREAM_ERROR', 'escavador', 'HTTP 500');
    expect(err.message).toContain('HTTP 500');
  });

  it('é instância de Error', () => {
    expect(new SourceError('AUTH_FAILED', 'escavador')).toBeInstanceOf(Error);
  });

  it.each([
    'TIMEOUT', 'SCHEMA_MISMATCH', 'AUTH_FAILED',
    'CIRCUIT_OPEN', 'RATE_LIMITED', 'NOT_FOUND', 'UPSTREAM_ERROR',
  ] as const)('aceita kind válido: %s', (kind) => {
    expect(() => new SourceError(kind, 'src')).not.toThrow();
  });
});
