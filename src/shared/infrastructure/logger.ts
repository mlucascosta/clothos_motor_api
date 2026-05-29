/**
 * @fileoverview Logger singleton pino para o motor de consultas.
 * Emite JSON estruturado conforme contrato de observabilidade CLOTHOS.
 *
 * Campos obrigatórios em todo log:
 *   timestamp, level, component="motor", message
 *
 * Para logs de operação de query propagar correlationId:
 *   logger.child({ correlationId, tenantSlug }).info('evento')
 *
 * @see docs/architecture/OBSERVABILITY_CONTRACTS.md
 * @module shared/infrastructure/logger
 */

import pino from 'pino';

export const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  base: { component: 'motor' },
  timestamp: pino.stdTimeFunctions.isoTime,
});
