/**
 * @fileoverview Rota de health check do motor de consultas.
 * @module presentation/api/routes/health
 *
 * ## Endpoint
 * - `GET /health` — Retorna status da aplicação, nome do serviço e timestamp UTC
 *
 * Usado por load balancers, orquestradores (Kubernetes, ECS) e monitoramento.
 * Não requer autenticação Bearer.
 */

import { Hono } from 'hono';

const health = new Hono();

/**
 * GET /health
 * Retorna status de saúde da aplicação.
 *
 * @returns {object} `{ status: 'ok', service: 'clothos-motor', timestamp: string }`
 */
health.get('/', (c) =>
  c.json({ status: 'ok', service: 'clothos-motor', timestamp: new Date().toISOString() }),
);

export { health };
