import 'dotenv/config.js';
import { serve } from '@hono/node-server';
import { app } from './api/app.js';
import { logger } from '@shared/infrastructure/logger.js';

if (!process.env['MOTOR_INTERNAL_SECRET']) {
  logger.fatal('MOTOR_INTERNAL_SECRET não configurada — encerrando');
  process.exit(1);
}

const PORT = Number(process.env['PORT'] ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  logger.info({ port: PORT }, 'clothos-motor-api iniciado');
});
