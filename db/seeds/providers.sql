-- =============================================================================
-- seeds/providers.sql — Seed dos 6 providers do motor CLOTHOS
-- Slugs espelham os diretórios em src/infrastructure/providers/.
-- Circuit breaker inicializado no estado 'closed' (operacional).
-- ON CONFLICT DO NOTHING: idempotente — pode ser re-executado sem efeito.
-- =============================================================================

INSERT INTO clothos_core.providers (slug, name, circuit_breaker_state, enabled)
VALUES
  (
    'escavador',
    'Escavador',
    '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
    true
  ),
  (
    'datajud',
    'DataJud (CNJ)',
    '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
    true
  ),
  (
    'directdata',
    'DirectData',
    '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
    true
  ),
  (
    'apibrasil',
    'APIBrasil',
    '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
    true
  ),
  (
    'infosimples',
    'Infosimples',
    '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
    true
  ),
  (
    'brasilapi',
    'BrasilAPI',
    '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
    true
  )
ON CONFLICT (slug) DO NOTHING;
