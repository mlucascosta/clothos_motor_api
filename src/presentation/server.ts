import 'dotenv/config.js';
import { serve } from '@hono/node-server';
import { app } from './api/app.js';

const PORT = Number(process.env['PORT'] ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`clothos-motor-api running on port ${PORT}`);
});
